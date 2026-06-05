"use client";
import { useState } from "react";
import { CreditCard, Download, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { TableSkeleton } from "@/components/shared/loaders";
import { useAsync } from "@/hooks/use-async";
import { getAllPayments } from "@/services/payments.service";
import { formatMNT, formatDate } from "@/lib/utils";
import type { PaymentStatus, PaymentMethod } from "@/types";

const METHOD_LABEL: Record<PaymentMethod, string> = { card: "Карт", qpay: "QPay", bank: "Банк" };
const PAY_LABEL: Record<PaymentStatus, string> = {
  paid: "Төлсөн", pending: "Хүлээгдэж буй", failed: "Амжилтгүй", refunded: "Буцаагдсан",
};
const PAY_VARIANT: Record<PaymentStatus, "success" | "warning" | "destructive" | "secondary"> = {
  paid: "success", pending: "warning", failed: "destructive", refunded: "secondary",
};

export default function AdminPaymentsPage() {
  const { data, loading, error, reload } = useAsync(() => getAllPayments(), []);
  const [status, setStatus] = useState<PaymentStatus | "all">("all");

  const filtered = (data ?? []).filter((p) => status === "all" || p.paymentStatus === status);
  const revenue = (data ?? []).filter((p) => p.paymentStatus === "paid").reduce((s, p) => s + p.amount, 0);

  function exportCsv() {
    const rows = [
      ["Гүйлгээний дугаар", "Хэрэглэгч", "Сургалт", "Дүн", "Хэлбэр", "Төлөв", "Огноо"],
      ...filtered.map((p) => [
        p.transactionId,
        p.userName ?? "",
        p.trainingTitle ?? "",
        String(p.amount),
        METHOD_LABEL[p.paymentMethod],
        PAY_LABEL[p.paymentStatus],
        new Date(p.createdAt).toISOString(),
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Төлбөрүүд</h1>
          <p className="text-sm text-muted-foreground">Төлбөрийн түүх, тайлан</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={status} onValueChange={(v) => setStatus(v as PaymentStatus | "all")}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Бүгд</SelectItem>
              <SelectItem value="paid">Төлсөн</SelectItem>
              <SelectItem value="pending">Хүлээгдэж буй</SelectItem>
              <SelectItem value="failed">Амжилтгүй</SelectItem>
              <SelectItem value="refunded">Буцаагдсан</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportCsv} disabled={filtered.length === 0}>
            <Download className="h-4 w-4" /> Тайлан татах
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="flex items-center justify-between pt-6">
          <div>
            <p className="text-sm text-muted-foreground">Нийт орлого (төлсөн)</p>
            <p className="text-3xl font-bold">{formatMNT(revenue)}</p>
          </div>
          <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-500"><TrendingUp className="h-6 w-6" /></div>
        </CardContent>
      </Card>

      {loading ? (
        <TableSkeleton rows={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : filtered.length === 0 ? (
        <EmptyState icon={CreditCard} title="Төлбөр алга" />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Гүйлгээ</TableHead>
                  <TableHead>Хэрэглэгч</TableHead>
                  <TableHead>Сургалт</TableHead>
                  <TableHead>Дүн</TableHead>
                  <TableHead>Хэлбэр</TableHead>
                  <TableHead>Төлөв</TableHead>
                  <TableHead>Огноо</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs">{p.transactionId}</TableCell>
                    <TableCell>{p.userName ?? "—"}</TableCell>
                    <TableCell>{p.trainingTitle ?? "Сургалт"}</TableCell>
                    <TableCell>{formatMNT(p.amount)}</TableCell>
                    <TableCell>{METHOD_LABEL[p.paymentMethod]}</TableCell>
                    <TableCell><Badge variant={PAY_VARIANT[p.paymentStatus]}>{PAY_LABEL[p.paymentStatus]}</Badge></TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{formatDate(p.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
}
