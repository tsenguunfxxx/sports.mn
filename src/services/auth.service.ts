import { supabase } from "@/lib/supabase/client";
import { mapUser } from "@/lib/mappers";
import type { ProfileRow } from "@/lib/supabase/types";
import type { AppUser } from "@/types";

export async function registerUser(input: {
  name: string;
  email: string;
  phone: string;
  password: string;
}): Promise<AppUser> {
  // The profile row is created automatically by a Postgres trigger
  // (handle_new_user) using the metadata passed here.
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: { data: { name: input.name, phone: input.phone } },
  });
  if (error) throw error;
  if (!data.user) throw new Error("Бүртгэл үүсгэхэд алдаа гарлаа");

  const profile = await getUserProfile(data.user.id);
  return (
    profile ?? {
      id: data.user.id,
      name: input.name,
      email: input.email,
      phone: input.phone,
      role: "user",
      profileImage: "",
      blocked: false,
      createdAt: Date.now(),
    }
  );
}

export async function loginUser(email: string, password: string): Promise<AppUser> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  if (!data.user) throw new Error("Хэрэглэгчийн мэдээлэл олдсонгүй");

  const profile = await getUserProfile(data.user.id);
  if (!profile) throw new Error("Хэрэглэгчийн мэдээлэл олдсонгүй");
  if (profile.blocked) {
    await supabase.auth.signOut();
    throw new Error("Таны бүртгэлийг түр хязгаарласан байна");
  }
  return profile;
}

export async function logoutUser(): Promise<void> {
  await supabase.auth.signOut();
}

export async function resetPassword(email: string): Promise<void> {
  const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/login` : undefined;
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) throw error;
}

export async function getUserProfile(uid: string): Promise<AppUser | null> {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", uid).maybeSingle();
  if (error) throw error;
  return data ? mapUser(data as ProfileRow) : null;
}
