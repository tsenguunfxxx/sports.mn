import { supabase } from "@/lib/supabase/client";
import { mapNotification } from "@/lib/mappers";
import type { NotificationRow } from "@/lib/supabase/types";
import type { AppNotification } from "@/types";

export async function createNotification(
  data: Omit<AppNotification, "id" | "read" | "createdAt">,
): Promise<string> {
  const { data: row, error } = await supabase
    .from("notifications")
    .insert({
      user_id: data.userId,
      title: data.title,
      message: data.message,
      type: data.type,
      read: false,
    })
    .select("id")
    .single();
  if (error) throw error;
  return (row as { id: string }).id;
}

export async function getUserNotifications(userId: string): Promise<AppNotification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as NotificationRow[]).map(mapNotification);
}

export async function markNotificationRead(id: string): Promise<void> {
  const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id);
  if (error) throw error;
}
