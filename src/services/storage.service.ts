import { supabase } from "@/lib/supabase/client";

const IMAGE_BUCKET = "images";
const AVATAR_BUCKET = "avatars";

function safeName(name: string): string {
  return name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9.\-_]/g, "");
}

export async function uploadImage(file: File, folder = "uploads"): Promise<string> {
  const path = `${folder}/${Date.now()}-${safeName(file.name)}`;
  const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(path, file, { upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadAvatar(file: File, uid: string): Promise<string> {
  const path = `${uid}/${Date.now()}-${safeName(file.name)}`;
  const { error } = await supabase.storage.from(AVATAR_BUCKET).upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
