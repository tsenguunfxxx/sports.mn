import { supabase } from "@/lib/supabase/client";
import { mapSport } from "@/lib/mappers";
import type { SportRow } from "@/lib/supabase/types";
import type { Sport } from "@/types";

export async function getSports(onlyActive = false): Promise<Sport[]> {
  let q = supabase.from("sports").select("*").order("created_at", { ascending: false });
  if (onlyActive) q = q.eq("active", true);
  const { data, error } = await q;
  if (error) throw error;
  return (data as SportRow[]).map(mapSport);
}

export async function getSport(id: string): Promise<Sport | null> {
  const { data, error } = await supabase.from("sports").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? mapSport(data as SportRow) : null;
}

export async function createSport(data: Omit<Sport, "id" | "createdAt">): Promise<string> {
  const { data: row, error } = await supabase
    .from("sports")
    .insert({
      name: data.name,
      icon: data.icon,
      image: data.image,
      description: data.description,
      active: data.active,
    })
    .select("id")
    .single();
  if (error) throw error;
  return (row as { id: string }).id;
}

export async function updateSport(id: string, data: Partial<Sport>): Promise<void> {
  const patch: Record<string, unknown> = {};
  if (data.name !== undefined) patch.name = data.name;
  if (data.icon !== undefined) patch.icon = data.icon;
  if (data.image !== undefined) patch.image = data.image;
  if (data.description !== undefined) patch.description = data.description;
  if (data.active !== undefined) patch.active = data.active;
  const { error } = await supabase.from("sports").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteSport(id: string): Promise<void> {
  const { error } = await supabase.from("sports").delete().eq("id", id);
  if (error) throw error;
}
