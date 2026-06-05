import { supabase } from "@/lib/supabase/client";
import { mapUser } from "@/lib/mappers";
import type { ProfileRow } from "@/lib/supabase/types";
import type { AppUser } from "@/types";

export async function getAllUsers(): Promise<AppUser[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as ProfileRow[]).map(mapUser);
}

export async function setUserBlocked(uid: string, blocked: boolean): Promise<void> {
  const { error } = await supabase.from("profiles").update({ blocked }).eq("id", uid);
  if (error) throw error;
}

export async function setUserRole(uid: string, role: AppUser["role"]): Promise<void> {
  const { error } = await supabase.from("profiles").update({ role }).eq("id", uid);
  if (error) throw error;
}

export async function updateUserProfile(uid: string, data: Partial<AppUser>): Promise<void> {
  const patch: Record<string, unknown> = {};
  if (data.name !== undefined) patch.name = data.name;
  if (data.phone !== undefined) patch.phone = data.phone;
  if (data.profileImage !== undefined) patch.profile_image = data.profileImage;
  const { error } = await supabase.from("profiles").update(patch).eq("id", uid);
  if (error) throw error;
}
