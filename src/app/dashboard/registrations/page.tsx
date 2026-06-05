"use client";
import Link from "next/link";
import { Ticket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { TableSkeleton } from "@/components/shared/loaders";
import { useAuth } from "@/hooks/use-auth";
import { useAsync } from "@/hooks/use-async";
import { getUserRegistrations } from "@/services/registrations.service";
import { formatMNT, formatDate } from "@/lib/utils";
import type { RegistrationStatus, PaymentStatus } from "@/types";

const STATUS_LABEL: Record<RegistrationStatus, string> = {
  pending: "Хүлээгдэж буй",
  approved: "Баталгаажсан",
  cancelled: "Цуцлагдсан",
};
const STATUS_VARIANT: Record<RegistrationStatus, "warning" | "success" | "destructive"> = {
  pending: "warning",
  approved: "success",
  cancelled: "destructive",
};
const PAY_LABEL: Record<PaymentStatus, string> = {
  pending: "Төлбөр хүлээгдэж буй",
  paid: "Төлсөн",
  failed: "Амжилтгүй",
  refunded: "Буцаагдсан",
};

export default function RegistrationsPage() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useAsync(
    () => (user ? getUserRegistrations(user.id) : Promise.resolve([])),
    [user?.id]
  );

  if (loading) return <TableSkeleton rows={4} />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data || data.length === 0)
    return (
      <EmptyState
        icon={Ticket}
        title="Бүртгэл алга"
        description="Та одоогоор ямар нэг сургалтад бүртгүүлээгүй байна."
      />
    );

  return (
    <div className="space-y-4">
      {data.map((reg) => (
        <Card key={reg.id}>
          <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <Link href={`/trainings/${reg.trainingId}`} className="font-semibold hover:underline">
                {reg.trainingTitle ?? "Сургалт"}
              </Link>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                <Badge variant={STATUS_VARIANT[reg.status]}>{STATUS_LABEL[reg.status]}</Badge>
                <span className="text-muted-foreground">{PAY_LABEL[reg.paymentStatus]}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Огноо: {formatDate(reg.registrationDate)}</p>
            </div>
            <div className="flex items-center gap-3">
              {reg.price != null && <span className="font-semibold">{formatMNT(reg.price)}</span>}
              {reg.paymentStatus === "pending" && reg.status !== "cancelled" && (
                <Button asChild size="sm">
                  <Link href={`/payment/${reg.id}`}>Төлбөр төлөх</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
