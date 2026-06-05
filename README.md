# Sport.mn 🏐🏀

Монгол хэл дээрх спорт сургалтын маркетплэйс. Хэрэглэгчид сургалт хайж, бүртгүүлж, төлбөр төлж, өөрийн булангаа удирдана. Админ нь спорт, сургалт, хэрэглэгч, бүртгэл, төлбөрийг удирдана.

Production-ready full-stack аппликейшн — **Supabase** (Postgres + Auth + Storage) суурьтай.

## Tech Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** + **Shadcn UI** (new-york), dark mode
- **Supabase**: Postgres, Auth (email/нууц үг), Storage, Row Level Security
- **React Hook Form** + **Zod** (валидаци)
- **Zustand** (state management)
- Mobile-first responsive

## Folder Structure

```
src/
  app/            # App Router pages (home, auth, trainings, dashboard, payment, admin)
  components/     # ui/ (shadcn), layout/, home/, trainings/, shared/
  features/       # auth-provider
  services/       # Supabase data access (auth, sports, trainings, registrations, payments, ...)
  hooks/          # use-auth, use-async
  store/          # Zustand stores (auth, ui)
  types/          # домэйн TypeScript төрлүүд (camelCase)
  lib/
    supabase/     # client.ts (browser client), types.ts (row төрлүүд)
    mappers.ts    # Postgres row (snake_case) → домэйн (camelCase)
    utils, validations
supabase/schema.sql  # бүх хүснэгт, RLS бодлого, trigger, storage bucket
scripts/seed.ts      # анхдагч спорт + сургалтын өгөгдөл
```

## 1. Supabase төсөл үүсгэх

1. [supabase.com](https://supabase.com) → **New project** (нэр, өгөгдлийн сангийн нууц үг, бүс).
2. Төсөл бэлэн болсны дараа **Project Settings → API** хэсгээс дараахыг ав:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** secret → `SUPABASE_SERVICE_ROLE_KEY` (зөвхөн сервер талд!)
3. **Authentication → Providers → Email** идэвхтэй эсэхийг шалга. Хөгжүүлэлтийн үед шуурхай нэвтрэхийн тулд **Authentication → Sign In / Providers → Email → "Confirm email"**-ийг **унтрааж** болно (эсвэл асаалттай орхиж, баталгаажуулах и-мэйлээр нэвтэрнэ).

## 2. Орчны хувьсагч (.env.local)

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret
```

> `SUPABASE_SERVICE_ROLE_KEY` нь зөвхөн `scripts/seed.ts`-д ашиглагдана. Клиент тал руу хэзээ ч задлахгүй (`NEXT_PUBLIC_` угтваргүй тул bundle-д орохгүй).

## 3. Өгөгдлийн сангийн бүтэц (schema) суулгах

`supabase/schema.sql`-ийг Supabase дээр ажиллуул:

- **Supabase Dashboard → SQL Editor → New query** → `supabase/schema.sql`-ийн агуулгыг хуулж тавиад **Run**.
- (Эсвэл CLI-аар: `supabase db execute --file supabase/schema.sql`.)

Энэ скрипт дараахыг үүсгэнэ:

- Хүснэгтүүд: `profiles, sports, trainings, registrations, payments, notifications`
- **RLS бодлого** — хэрэглэгч зөвхөн өөрийн өгөгдлийг үзэх/засах; спорт, сургалт нийтэд нээлттэй; бичих эрх зөвхөн админд
- `is_admin()` тусгай функц
- Бүртгүүлэхэд `profiles` мөр автоматаар үүсгэх **trigger** (`handle_new_user`)
- Role/блок өөрөө өөрчлөхөөс хамгаалах trigger
- `trainings.current_participants`-ийг (төлбөртэй, цуцлагдаагүй бүртгэлээр) автоматаар тоолох trigger
- Storage bucket-ууд: `avatars` (хэрэглэгчийн зураг), `images` (сургалт/спортын зураг) + бодлого
- Шаардлагатай индексүүд

## 4. Суулгах & ажиллуулах

```bash
npm install
npm run dev      # http://localhost:3000
```

## 5. Анхдагч өгөгдөл оруулах (seed)

`schema.sql`-ийг ажиллуулсны **дараа**:

```bash
npm run seed
```

**Волейбол**, **Сагсан бөмбөг** хоёр спорт + 4 жишээ сургалт үүсгэнэ. Дахин ажиллуулахад давхардуулахгүй (нэр/гарчгаар шалгана).

## 6. Эхний админ үүсгэх

1. Аппд хэвийн **бүртгүүлнэ** (role нь анхдагчаар `user`).
2. Дараах аргуудын аль нэгээр админ болгоно:
   - `SEED_ADMIN_EMAIL=you@mail.com npm run seed`, эсвэл
   - Supabase **Table editor → profiles** → өөрийн мөрийн `role`-ийг `admin` болгож засна.
3. Дахин нэвтрэхэд `/admin` руу автоматаар чиглүүлнэ.

## 7. Production build & deploy

```bash
npm run build


Next.js-ийг **Vercel** (эсвэл Netlify, өөрийн сервер г.м.) дээр деплой хийхэд хамгийн хялбар:

1. Repo-г GitHub-д түлхэж, [vercel.com](https://vercel.com) дээр import хийнэ.
2. Орчны хувьсагчид (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) тохируулна. (`SUPABASE_SERVICE_ROLE_KEY`-г зөвхөн seed-д ашиглах тул production-д заавал биш.)
3. Deploy.

> Supabase нь Postgres/Auth/Storage-г хангадаг тул тусдаа backend сервер шаардлагагүй.

## Төлбөрийн систем

Төлбөр нь **симуляц** (demo) горимтой — жинхэнэ мөнгөн гүйлгээ хийдэггүй, gateway-ийн саатлыг дуурайн гүйлгээний дугаар үүсгэнэ. Бодит ашиглалтад `src/services/payments.service.ts` доторх `processPayment`-ийг **QPay** эсвэл **Голомт/Хаан банк** зэрэг бодит gateway-аар солино. Туршилтын карт: `4242 4242 4242 4242`, дурын ирээдүйн огноо, дурын CVV.

## Гол боломжууд

- И-мэйл бүртгэл/нэвтрэлт, нууц үг сэргээх, role-д суурилсан хандалт, хамгаалагдсан маршрутууд
- Спорт/сургалт хайх, шүүх (спорт, байршил, дасгалжуулагч, үнэ, түвшин), дэлгэрэнгүй хуудас
- Бүртгэл → төлбөр урсгал, багтаамжийн хяналт (DB trigger), мэдэгдэл
- Хэрэглэгчийн булан: профайл засах + зураг, бүртгэлүүд, төлбөрийн түүх, мэдэгдэл
- Админ самбар: статистик, спорт/сургалт CRUD, дасгалжуулагч, хэрэглэгч (хайх/блок/эрх), бүртгэл (батлах/цуцлах), төлбөр (шүүх/CSV тайлан), тохиргоо
- Loading skeleton, empty/error state, dark mode, бүрэн responsive

## Аюулгүй байдал (RLS)

Бүх хүснэгт дээр **Row Level Security** идэвхтэй. Клиент `anon` key ашигладаг ч өгөгдлийн хандалтыг Postgres бодлого хязгаарлана: хэрэглэгч зөвхөн өөрийн бүртгэл/төлбөр/мэдэгдлийг үзнэ, админ бүгдийг удирдана. Role болон блокийг зөвхөн админ өөрчилнө (trigger-ээр баталгаажсан).

## Скриптүүд

| Команд | Үйлдэл |
| --- | --- |
| `npm run dev` | Хөгжүүлэлтийн сервер |
| `npm run build` | Production build |
| `npm run start` | Production сервер |
| `npm run lint` | ESLint |
| `npm run seed` | Анхдагч өгөгдөл оруулах (service_role key шаардана) |
```
# sports.mn
