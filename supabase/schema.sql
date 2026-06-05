-- =============================================================
-- Sport.mn — Supabase schema (tables, RLS, triggers, storage)
-- Run this in the Supabase SQL Editor (or via the CLI) once per project.
-- Re-runnable: drops/recreates policies & triggers idempotently.
-- =============================================================

-- ---------- Tables ----------

create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  name         text not null default '',
  email        text not null default '',
  phone        text,
  role         text not null default 'user' check (role in ('user','admin')),
  profile_image text,
  blocked      boolean not null default false,
  created_at   timestamptz not null default now()
);

create table if not exists public.sports (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  icon        text not null default 'Activity',
  image       text,
  description text not null default '',
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.trainings (
  id                   uuid primary key default gen_random_uuid(),
  sport_id             uuid not null references public.sports (id) on delete cascade,
  title                text not null,
  description          text not null default '',
  coach_name           text not null default '',
  coach_image          text,
  location             text not null default '',
  schedule             text not null default '',
  duration             text not null default '',
  age_group            text not null default '',
  skill_level          text not null default 'all' check (skill_level in ('beginner','intermediate','advanced','all')),
  capacity             integer not null default 1 check (capacity >= 1),
  current_participants integer not null default 0,
  price                numeric not null default 0 check (price >= 0),
  image                text,
  active               boolean not null default true,
  created_at           timestamptz not null default now()
);

create table if not exists public.registrations (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users (id) on delete cascade,
  training_id       uuid not null references public.trainings (id) on delete cascade,
  status            text not null default 'pending' check (status in ('pending','approved','cancelled')),
  payment_status    text not null default 'pending' check (payment_status in ('pending','paid','failed','refunded')),
  registration_date timestamptz not null default now(),
  training_title    text,
  training_image    text,
  price             numeric,
  user_name         text,
  user_email        text
);

create table if not exists public.payments (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users (id) on delete cascade,
  training_id     uuid not null references public.trainings (id) on delete cascade,
  registration_id uuid not null references public.registrations (id) on delete cascade,
  amount          numeric not null default 0,
  payment_method  text not null default 'card' check (payment_method in ('card','qpay','bank')),
  payment_status  text not null default 'paid' check (payment_status in ('pending','paid','failed','refunded')),
  transaction_id  text not null,
  created_at      timestamptz not null default now(),
  training_title  text,
  user_name       text
);

create table if not exists public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  title      text not null,
  message    text not null default '',
  read       boolean not null default false,
  type       text not null default 'info' check (type in ('info','success','warning')),
  created_at timestamptz not null default now()
);

-- ---------- Indexes ----------

create index if not exists idx_trainings_sport     on public.trainings (sport_id);
create index if not exists idx_trainings_active    on public.trainings (active);
create index if not exists idx_trainings_created   on public.trainings (created_at desc);
create index if not exists idx_reg_user            on public.registrations (user_id);
create index if not exists idx_reg_training        on public.registrations (training_id);
create index if not exists idx_reg_date            on public.registrations (registration_date desc);
create index if not exists idx_pay_user            on public.payments (user_id);
create index if not exists idx_pay_created         on public.payments (created_at desc);
create index if not exists idx_notif_user_created  on public.notifications (user_id, created_at desc);

-- ---------- Helper: is_admin() ----------
-- SECURITY DEFINER so it bypasses RLS (prevents recursion on profiles policies).

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- ---------- Trigger: auto-create profile on signup ----------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'phone',
    'user'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Trigger: prevent role/blocked self-escalation ----------

create or replace function public.protect_profile_privileges()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (new.role is distinct from old.role or new.blocked is distinct from old.blocked)
     and not public.is_admin() then
    raise exception 'Permission denied: cannot change role or blocked status';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_protect_privileges on public.profiles;
create trigger profiles_protect_privileges
  before update on public.profiles
  for each row execute function public.protect_profile_privileges();

-- ---------- Trigger: keep trainings.current_participants accurate ----------
-- Counts paid, non-cancelled registrations.

create or replace function public.recount_participants()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  tid uuid;
begin
  tid := coalesce(new.training_id, old.training_id);
  update public.trainings t
     set current_participants = (
       select count(*) from public.registrations r
       where r.training_id = tid
         and r.payment_status = 'paid'
         and r.status <> 'cancelled'
     )
   where t.id = tid;
  return coalesce(new, old);
end;
$$;

drop trigger if exists registrations_recount on public.registrations;
create trigger registrations_recount
  after insert or update or delete on public.registrations
  for each row execute function public.recount_participants();

-- ---------- Row Level Security ----------

alter table public.profiles      enable row level security;
alter table public.sports        enable row level security;
alter table public.trainings     enable row level security;
alter table public.registrations enable row level security;
alter table public.payments      enable row level security;
alter table public.notifications enable row level security;

-- profiles
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
  for update using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

-- sports (public read, admin write)
drop policy if exists sports_select on public.sports;
create policy sports_select on public.sports for select using (true);

drop policy if exists sports_write on public.sports;
create policy sports_write on public.sports
  for all using (public.is_admin()) with check (public.is_admin());

-- trainings (public read, admin write)
drop policy if exists trainings_select on public.trainings;
create policy trainings_select on public.trainings for select using (true);

drop policy if exists trainings_write on public.trainings;
create policy trainings_write on public.trainings
  for all using (public.is_admin()) with check (public.is_admin());

-- registrations
drop policy if exists reg_select on public.registrations;
create policy reg_select on public.registrations
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists reg_insert on public.registrations;
create policy reg_insert on public.registrations
  for insert with check (auth.uid() = user_id);

drop policy if exists reg_update on public.registrations;
create policy reg_update on public.registrations
  for update using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

drop policy if exists reg_delete on public.registrations;
create policy reg_delete on public.registrations
  for delete using (auth.uid() = user_id or public.is_admin());

-- payments
drop policy if exists pay_select on public.payments;
create policy pay_select on public.payments
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists pay_insert on public.payments;
create policy pay_insert on public.payments
  for insert with check (auth.uid() = user_id);

drop policy if exists pay_update on public.payments;
create policy pay_update on public.payments
  for update using (public.is_admin()) with check (public.is_admin());

-- notifications
drop policy if exists notif_select on public.notifications;
create policy notif_select on public.notifications
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists notif_insert on public.notifications;
create policy notif_insert on public.notifications
  for insert with check (auth.uid() = user_id or public.is_admin());

drop policy if exists notif_update on public.notifications;
create policy notif_update on public.notifications
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- Storage buckets & policies ----------

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true), ('images', 'images', true)
on conflict (id) do nothing;

-- avatars: public read; users manage files under a folder named after their uid
drop policy if exists avatars_read on storage.objects;
create policy avatars_read on storage.objects
  for select using (bucket_id = 'avatars');

drop policy if exists avatars_insert on storage.objects;
create policy avatars_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists avatars_update on storage.objects;
create policy avatars_update on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists avatars_delete on storage.objects;
create policy avatars_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- images: public read; admin-only write (training/sport images)
drop policy if exists images_read on storage.objects;
create policy images_read on storage.objects
  for select using (bucket_id = 'images');

drop policy if exists images_insert on storage.objects;
create policy images_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'images' and public.is_admin());

drop policy if exists images_update on storage.objects;
create policy images_update on storage.objects
  for update to authenticated
  using (bucket_id = 'images' and public.is_admin());

drop policy if exists images_delete on storage.objects;
create policy images_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'images' and public.is_admin());
