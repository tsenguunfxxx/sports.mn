"use client";
import { useState } from "react";
import { Search, Users, Loader2, ShieldCheck, ShieldOff, Ban, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { TableSkeleton } from "@/components/shared/loaders";
import { useAuth } from "@/hooks/use-auth";
import { useAsync } from "@/hooks/use-async";
import { getAllUsers, setUserBlocked, setUserRole } from "@/services/users.service";
import { formatDate } from "@/lib/utils";

export default function AdminUsersPage() {
  const { user: me } = useAuth();
  const { data, loading, error, reload, setData } = useAsync(() => getAllUsers(), []);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const filtered = (data ?? []).filter((u) => {
    const t = q.toLowerCase();
    return !t || u.name.toLowerCase().includes(t) || u.email.toLowerCase().includes(t) || u.phone.includes(t);
  });

  async function toggleBlock(uid: string, blocked: boolean) {
    setBusy(uid);
    try {
      await setUserBlocked(uid, blocked);
      setData((prev) => (prev ? prev.map((u) => (u.id === uid ? { ...u, blocked } : u)) : prev));
      toast.success(blocked ? "Хэрэглэгч блоклогдлоо" : "Блок цуцлагдлаа");
    } catch {
      toast.error("Алдаа гарлаа");
    } finally {
      setBusy(null);
    }
  }

  async function toggleRole(uid: string, role: "user" | "admin") {
    setBusy(uid);
    try {
      await setUserRole(uid, role);
      setData((prev) => (prev ? prev.map((u) => (u.id === uid ? { ...u, role } : u)) : prev));
      toast.success("Эрх шинэчлэгдлээ");
    } catch {
      toast.error("Алдаа гарлаа");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Хэрэглэгчид</h1>
        <p className="text-sm text-muted-foreground">Хэрэглэгчдийг хайх, эрх удирдах, блоклох</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Нэр, и-мэйл, утсаар хайх" className="pl-9" />
      </div>

      {loading ? (
        <TableSkeleton rows={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Users} title="Хэрэглэгч олдсонгүй" />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Хэрэглэгч</TableHead>
                  <TableHead>Утас</TableHead>
                  <TableHead>Эрх</TableHead>
                  <TableHead>Төлөв</TableHead>
                  <TableHead>Бүртгүүлсэн</TableHead>
                  <TableHead className="text-right">Үйлдэл</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((u) => {
                  const isSelf = u.id === me?.id;
                  return (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={u.profileImage} alt={u.name} />
                            <AvatarFallback>{u.name.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium">{u.name}</p>
                            <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{u.phone || "—"}</TableCell>
                      <TableCell><Badge variant={u.role === "admin" ? "default" : "secondary"}>{u.role === "admin" ? "Админ" : "Хэрэглэгч"}</Badge></TableCell>
                      <TableCell><Badge variant={u.blocked ? "destructive" : "success"}>{u.blocked ? "Блоктой" : "Идэвхтэй"}</Badge></TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{formatDate(u.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {busy === u.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Button
                                variant="ghost" size="icon" title={u.role === "admin" ? "Эрх хасах" : "Админ болгох"}
                                disabled={isSelf}
                                onClick={() => toggleRole(u.id, u.role === "admin" ? "user" : "admin")}
                              >
                                {u.role === "admin" ? <ShieldOff className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                              </Button>
                              <Button
                                variant="ghost" size="icon" className={u.blocked ? "text-emerald-600" : "text-destructive"}
                                title={u.blocked ? "Блок цуцлах" : "Блоклох"}
                                disabled={isSelf}
                                onClick={() => toggleBlock(u.id, !u.blocked)}
                              >
                                {u.blocked ? <CheckCircle2 className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
}
