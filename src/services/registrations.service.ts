import { supabase } from "@/lib/supabase/client";
import { mapRegistration } from "@/lib/mappers";
import type { RegistrationRow } from "@/lib/supabase/types";
import { getTraining } from "./trainings.service";
import { createNotification } from "./notifications.service";
import type { Registration, RegistrationStatus, AppUser } from "@/types";

// Note: trainings.current_participants is maintained automatically by a
// Postgres trigger that counts paid, non-cancelled registrations.

export async function createRegistration(user: AppUser, trainingId: string): Promise<string> {
  const training = await getTraining(trainingId);
  if (!training) throw new Error("Сургалт олдсонгүй");
  if (training.currentParticipants >= training.capacity) throw new Error("Багтаамж дүүрсэн байна");

  // Prevent duplicate active registrations.
  const { data: existing, error: exErr } = await supabase
    .from("registrations")
    .select("id,status")
    .eq("user_id", user.id)
    .eq("training_id", trainingId)
    .neq("status", "cancelled");
  if (exErr) throw exErr;
  if (existing && existing.length > 0) return (existing[0] as { id: string }).id;

  const { data: row, error } = await supabase
    .from("registrations")
    .insert({
      user_id: user.id,
      training_id: trainingId,
      status: "pending",
      payment_status: "pending",
      training_title: training.title,
      training_image: training.image,
      price: training.price,
      user_name: user.name,
      user_email: user.email,
    })
    .select("id")
    .single();
  if (error) throw error;

  await createNotification({
    userId: user.id,
    title: "Бүртгэл үүслээ",
    message: `Та "${training.title}" сургалтад бүртгүүллээ. Төлбөрөө төлнө үү.`,
    type: "info",
  });
  return (row as { id: string }).id;
}

export async function getRegistration(id: string): Promise<Registration | null> {
  const { data, error } = await supabase.from("registrations").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? mapRegistration(data as RegistrationRow) : null;
}

export async function getUserRegistrations(userId: string): Promise<Registration[]> {
  const { data, error } = await supabase
    .from("registrations")
    .select("*")
    .eq("user_id", userId)
    .order("registration_date", { ascending: false });
  if (error) throw error;
  return (data as RegistrationRow[]).map(mapRegistration);
}

export async function getAllRegistrations(): Promise<Registration[]> {
  const { data, error } = await supabase
    .from("registrations")
    .select("*")
    .order("registration_date", { ascending: false });
  if (error) throw error;
  return (data as RegistrationRow[]).map(mapRegistration);
}

export async function updateRegistrationStatus(id: string, status: RegistrationStatus): Promise<void> {
  const reg = await getRegistration(id);
  const { error } = await supabase.from("registrations").update({ status }).eq("id", id);
  if (error) throw error;
  if (reg) {
    await createNotification({
      userId: reg.userId,
      title: "Бүртгэлийн төлөв шинэчлэгдлээ",
      message: `Таны "${reg.trainingTitle}" бүртгэлийн төлөв: ${status}`,
      type: status === "approved" ? "success" : status === "cancelled" ? "warning" : "info",
    });
  }
}

export async function setRegistrationPaid(id: string): Promise<void> {
  const { error } = await supabase
    .from("registrations")
    .update({ payment_status: "paid", status: "approved" })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteRegistration(id: string): Promise<void> {
  const { error } = await supabase.from("registrations").delete().eq("id", id);
  if (error) throw error;
}
