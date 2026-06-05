"use client";
import { Bell, CheckCheck, Info, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { TableSkeleton } from "@/components/shared/loaders";
import { useAuth } from "@/hooks/use-auth";
import { useAsync } from "@/hooks/use-async";
import { getUserNotifications, markNotificationRead } from "@/services/notifications.service";
import { formatDate, cn } from "@/lib/utils";
import type { AppNotification } from "@/types";

const ICON = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
} as const;
const ICON_COLOR = {
  info: "text-blue-500",
  success: "text-emerald-500",
  warning: "text-amber-500",
} as const;

export default function NotificationsPage() {
  const { user } = useAuth();
  const { data, loading, error, reload, setData } = useAsync(
    () => (user ? getUserNotifications(user.id) : Promise.resolve([])),
    [user?.id]
  );

  async function markRead(n: AppNotification) {
    if (n.read) return;
    try {
      await markNotificationRead(n.id);
      setData((prev) => (prev ? prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)) : prev));
    } catch {
      toast.error("Алдаа гарлаа");
    }
  }

  async function markAll() {
    if (!data) return;
    const unread = data.filter((n) => !n.read);
    if (unread.length === 0) return;
    try {
      await Promise.all(unread.map((n) => markNotificationRead(n.id)));
      setData((prev) => (prev ? prev.map((x) => ({ ...x, read: true })) : prev));
      toast.success("Бүгдийг уншсан болголоо");
    } catch {
      toast.error("Алдаа гарлаа");
    }
  }

  if (loading) return <TableSkeleton rows={4} />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data || data.length === 0)
    return <EmptyState icon={Bell} title="Мэдэгдэл алга" description="Танд одоогоор мэдэгдэл байхгүй байна." />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={markAll}>
          <CheckCheck className="h-4 w-4" /> Бүгдийг уншсан болгох
        </Button>
      </div>
      {data.map((n) => {
        const Icon = ICON[n.type];
        return (
          <Card
            key={n.id}
            onClick={() => markRead(n)}
            className={cn("cursor-pointer transition-colors", !n.read && "border-primary/40 bg-primary/5")}
          >
            <CardContent className="flex gap-3 pt-6">
              <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", ICON_COLOR[n.type])} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{n.title}</p>
                  {!n.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                </div>
                <p className="text-sm text-muted-foreground">{n.message}</p>
                <p className="mt-1 text-xs text-muted-foreground">{formatDate(n.createdAt)}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
