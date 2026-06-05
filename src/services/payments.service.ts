import { supabase } from "@/lib/supabase/client";
import { mapPayment } from "@/lib/mappers";
import type { PaymentRow } from "@/lib/supabase/types";
import { setRegistrationPaid } from "./registrations.service";
import { createNotification } from "./notifications.service";
import type { Payment, PaymentMethod, AppUser } from "@/types";

function genTxnId(): string {
  return "TXN-" + Math.random().toString(36).slice(2, 10).toUpperCase() + "-" + Date.now().toString().slice(-5);
}

// Simulated payment processing. Replace with a real gateway (QPay, Golomt, etc.).
export async function processPayment(input: {
  user: AppUser;
  trainingId: string;
  registrationId: string;
  amount: number;
  method: PaymentMethod;
  trainingTitle?: string;
}): Promise<Payment> {
  await new Promise((r) => setTimeout(r, 1200)); // simulate gateway latency

  const { data: row, error } = await supabase
    .from("payments")
    .insert({
      user_id: input.user.id,
      training_id: input.trainingId,
      registration_id: input.registrationId,
      amount: input.amount,
      payment_method: input.method,
      payment_status: "paid",
      transaction_id: genTxnId(),
      training_title: input.trainingTitle ?? null,
      user_name: input.user.name,
    })
    .select("*")
    .single();
  if (error) throw error;

  await setRegistrationPaid(input.registrationId);
  await createNotification({
    userId: input.user.id,
    title: "Төлбөр амжилттай",
    message: `${input.trainingTitle ?? "Сургалт"} — төлбөр баталгаажлаа.`,
    type: "success",
  });
  return mapPayment(row as PaymentRow);
}

export async function getUserPayments(userId: string): Promise<Payment[]> {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as PaymentRow[]).map(mapPayment);
}

export async function getAllPayments(): Promise<Payment[]> {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as PaymentRow[]).map(mapPayment);
}

export async function refundPayment(id: string): Promise<void> {
  const { error } = await supabase.from("payments").update({ payment_status: "refunded" }).eq("id", id);
  if (error) throw error;
}
