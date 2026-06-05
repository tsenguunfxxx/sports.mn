"use client";
import { useState } from "react";
import { Ticket, Loader2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
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
import { getAllRegistrations, updateRegistrationStatus } from "@/services/registrations.service";
import { formatMNT, formatDate } from "@/lib/utils";
import type { RegistrationStatus } from "@/types";

const STATUS_LABEL: Record<RegistrationStatus, string> = {
  pending: "Хүлээгдэж буй", approved: "Баталгаажсан", cancelled: "Цуцлагдсан",
};
const STATUS_VARIANT: Record<RegistrationStatus, "warning" | "success" | "destructive"> = {
  pending: "warning", approved: "success", cancelled: "destructive",
};

export default function AdminRegistrationsPage() {
  const { data, loading, error, reload, setData } = useAsync(() => getAllRegistrations(), []);
  const [filter, setFilter] = useState<RegistrationStatus | "all">("all");
  const [busy, setBusy] = useState<string | null>(null);

  const filtered = (data ?? []).filter((r) => filter === "all" || r.status === filter);

  async function setStatus(id: string, status: RegistrationStatus) {
    setBusy(id);
    try {
      await updateRegistrationStatus(id, status);
      setData((prev) => (prev ? prev.map((r) => (r.id === id ? { ...r, status } : r)) : prev));
      toast.success("Төлөв шинэчлэгдлээ");
    } catch {
      toast.error("Алдаа гарлаа");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Бүртгэлүүд</h1>
          <p className="text-sm text-muted-foreground">Сургалтын бүртгэлийг баталгаажуулах, цуцлах</p>
        </div>
        <Select value={filter} onValueChange={(v) => setFilter(v as RegistrationStatus | "all")}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Бүгд</SelectItem>
            <SelectItem value="pending">Хүлээгдэж буй</SelectItem>
            <SelectItem value="approved">Баталгаажсан</SelectItem>
            <SelectItem value="cancelled">Цуцлагдсан</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <TableSkeleton rows={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Ticket} title="Бүртгэл алга" />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Хэрэглэгч</TableHead>
                  <TableHead>Сургалт</TableHead>
                  <TableHead>Үнэ</TableHead>
                  <TableHead>Төлбөр</TableHead>
                  <TableHead>Төлөв</TableHead>
                  <TableHead>Огноо</TableHead>
                  <TableHead className="text-right">Үйлдэл</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <p className="font-medium">{r.userName ?? "—"}</p>
                      <p className="text-xs text-muted-foreground">{r.userEmail}</p>
                    </TableCell>
                    <TableCell>{r.trainingTitle ?? "Сургалт"}</TableCell>
                    <TableCell>{r.price != null ? formatMNT(r.price) : "—"}</TableCell>
                    <TableCell>
                      <Badge variant={r.paymentStatus === "paid" ? "success" : "warning"}>
                        {r.paymentStatus === "paid" ? "Төлсөн" : "Хүлээгдэж буй"}
                      </Badge>
                    </TableCell>
                    <TableCell><Badge variant={STATUS_VARIANT[r.status]}>{STATUS_LABEL[r.status]}</Badge></TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{formatDate(r.registrationDate)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {busy === r.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Button variant="ghost" size="icon" className="text-emerald-600" title="Батлах"
                              disabled={r.status === "approved"} onClick={() => setStatus(r.id, "approved")}>
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive" title="Цуцлах"
                              disabled={r.status === "cancelled"} onClick={() => setStatus(r.id, "cancelled")}>
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
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
