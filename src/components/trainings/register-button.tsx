"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { createRegistration } from "@/services/registrations.service";
import type { Training } from "@/types";

export function RegisterButton({ training }: { training: Training }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const full = training.currentParticipants >= training.capacity;

  async function handleRegister() {
    if (!user) {
      toast.info("Эхлээд нэвтэрнэ үү");
      router.push(`/login?redirect=/trainings/${training.id}`);
      return;
    }
    if (full) {
      toast.error("Багтаамж дүүрсэн байна");
      return;
    }
    setSubmitting(true);
    try {
      const regId = await createRegistration(user, training.id);
      toast.success("Бүртгэл үүслээ. Төлбөрөө төлнө үү.");
      router.push(`/payment/${regId}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Алдаа гарлаа");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Button size="lg" className="w-full" disabled={loading || submitting || full} onClick={handleRegister}>
      {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
      {full ? "Багтаамж дүүрсэн" : "Бүртгүүлэх"}
    </Button>
  );
}
