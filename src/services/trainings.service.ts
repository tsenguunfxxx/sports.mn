import { supabase } from "@/lib/supabase/client";
import { mapTraining } from "@/lib/mappers";
import type { TrainingRow } from "@/lib/supabase/types";
import type { Training, TrainingFilters } from "@/types";

export async function getTrainings(filters: TrainingFilters = {}, onlyActive = true): Promise<Training[]> {
  let q = supabase.from("trainings").select("*").order("created_at", { ascending: false });
  if (onlyActive) q = q.eq("active", true);
  if (filters.sportId) q = q.eq("sport_id", filters.sportId);
  if (typeof filters.minPrice === "number") q = q.gte("price", filters.minPrice);
  if (typeof filters.maxPrice === "number") q = q.lte("price", filters.maxPrice);
  const { data, error } = await q;
  if (error) throw error;
  let items = (data as TrainingRow[]).map(mapTraining);

  // Client-side filtering for free-text fields.
  if (filters.search) {
    const s = filters.search.toLowerCase();
    items = items.filter(
      (t) =>
        t.title.toLowerCase().includes(s) ||
        t.description.toLowerCase().includes(s) ||
        t.coachName.toLowerCase().includes(s),
    );
  }
  if (filters.location) items = items.filter((t) => t.location.toLowerCase().includes(filters.location!.toLowerCase()));
  if (filters.coach) items = items.filter((t) => t.coachName.toLowerCase().includes(filters.coach!.toLowerCase()));
  if (filters.skillLevel && filters.skillLevel !== "all")
    items = items.filter((t) => t.skillLevel === filters.skillLevel || t.skillLevel === "all");
  return items;
}

export async function getFeaturedTrainings(max = 6): Promise<Training[]> {
  const items = await getTrainings({}, true);
  return items.slice(0, max);
}

export async function getTraining(id: string): Promise<Training | null> {
  const { data, error } = await supabase.from("trainings").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? mapTraining(data as TrainingRow) : null;
}

export async function createTraining(
  data: Omit<Training, "id" | "createdAt" | "currentParticipants">,
): Promise<string> {
  const { data: row, error } = await supabase
    .from("trainings")
    .insert({
      sport_id: data.sportId,
      title: data.title,
      description: data.description,
      coach_name: data.coachName,
      coach_image: data.coachImage || null,
      location: data.location,
      schedule: data.schedule,
      duration: data.duration,
      age_group: data.ageGroup,
      skill_level: data.skillLevel,
      capacity: data.capacity,
      current_participants: 0,
      price: data.price,
      image: data.image,
      active: data.active,
    })
    .select("id")
    .single();
  if (error) throw error;
  return (row as { id: string }).id;
}

export async function updateTraining(id: string, data: Partial<Training>): Promise<void> {
  const patch: Record<string, unknown> = {};
  if (data.sportId !== undefined) patch.sport_id = data.sportId;
  if (data.title !== undefined) patch.title = data.title;
  if (data.description !== undefined) patch.description = data.description;
  if (data.coachName !== undefined) patch.coach_name = data.coachName;
  if (data.coachImage !== undefined) patch.coach_image = data.coachImage || null;
  if (data.location !== undefined) patch.location = data.location;
  if (data.schedule !== undefined) patch.schedule = data.schedule;
  if (data.duration !== undefined) patch.duration = data.duration;
  if (data.ageGroup !== undefined) patch.age_group = data.ageGroup;
  if (data.skillLevel !== undefined) patch.skill_level = data.skillLevel;
  if (data.capacity !== undefined) patch.capacity = data.capacity;
  if (data.price !== undefined) patch.price = data.price;
  if (data.image !== undefined) patch.image = data.image;
  if (data.active !== undefined) patch.active = data.active;
  const { error } = await supabase.from("trainings").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteTraining(id: string): Promise<void> {
  const { error } = await supabase.from("trainings").delete().eq("id", id);
  if (error) throw error;
}
