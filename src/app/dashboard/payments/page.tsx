"use client";
import { CreditCard } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { TableSkeleton } from "@/components/shared/loaders";
import { useAuth } from "@/hooks/use-auth";
import { useAsync } from "@/hooks/use-async";
import { getUserPayments } from "@/services/payments.service";
import { formatMNT, formatDate } from "@/lib/utils";
import type { PaymentMethod, PaymentStatus } from "@/types";

const METHOD_LABEL: Record<PaymentMethod, string> = { card: "Карт", qpay: "QPay", bank: "Банк" };
const PAY_VARIANT: Record<PaymentStatus, "success" | "warning" | "destructive" | "secondary"> = {
  paid: "success",
  pending: "warning",
  failed: "destructive",
  refunded: "secondary",
};
const PAY_LABEL: Record<PaymentStatus, string> = {
  paid: "Төлсөн",
  pending: "Хүлээгдэж буй",
  failed: "Амжилтгүй",
  refunded: "Буцаагдсан",
};

export default function PaymentsPage() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useAsync(
    () => (user ? getUserPayments(user.id) : Promise.resolve([])),
    [user?.id]
  );

  if (loading) return <TableSkeleton rows={4} />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data || data.length === 0)
    return <EmptyState icon={CreditCard} title="Төлбөрийн түүх алга" description="Та одоогоор төлбөр төлөөгүй байна." />;

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Сургалт</TableHead>
              <TableHead>Дүн</TableHead>
              <TableHead>Хэлбэр</TableHead>
              <TableHead>Гүйлгээний дугаар</TableHead>
              <TableHead>Төлөв</TableHead>
              <TableHead>Огноо</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.trainingTitle ?? "Сургалт"}</TableCell>
                <TableCell>{formatMNT(p.amount)}</TableCell>
                <TableCell>{METHOD_LABEL[p.paymentMethod]}</TableCell>
                <TableCell className="font-mono text-xs">{p.transactionId}</TableCell>
                <TableCell><Badge variant={PAY_VARIANT[p.paymentStatus]}>{PAY_LABEL[p.paymentStatus]}</Badge></TableCell>
                <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{formatDate(p.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
