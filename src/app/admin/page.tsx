"use client";
import Link from "next/link";
import { Users, Dumbbell, GraduationCap, Ticket, CreditCard, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FullPageLoader } from "@/components/shared/loaders";
import { ErrorState } from "@/components/shared/error-state";
import { useAsync } from "@/hooks/use-async";
import { getAllUsers } from "@/services/users.service";
import { getSports } from "@/services/sports.service";
import { getTrainings } from "@/services/trainings.service";
import { getAllRegistrations } from "@/services/registrations.service";
import { getAllPayments } from "@/services/payments.service";
import { formatMNT, formatDate } from "@/lib/utils";

export default function AdminDashboard() {
  const { data, loading, error, reload } = useAsync(async () => {
    const [users, sports, trainings, registrations, payments] = await Promise.all([
      getAllUsers(),
      getSports(false),
      getTrainings({}, false),
      getAllRegistrations(),
      getAllPayments(),
    ]);
    return { users, sports, trainings, registrations, payments };
  }, []);

  if (loading) return <FullPageLoader />;
  if (error || !data) return <ErrorState message={error ?? undefined} onRetry={reload} />;

  const revenue = data.payments.filter((p) => p.paymentStatus === "paid").reduce((s, p) => s + p.amount, 0);
  const stats = [
    { label: "Хэрэглэгч", value: data.users.length, icon: Users, href: "/admin/users" },
    { label: "Спорт", value: data.sports.length, icon: Dumbbell, href: "/admin/sports" },
    { label: "Сургалт", value: data.trainings.length, icon: GraduationCap, href: "/admin/trainings" },
    { label: "Бүртгэл", value: data.registrations.length, icon: Ticket, href: "/admin/registrations" },
  ];

  const recent = [...data.registrations].sort((a, b) => b.registrationDate - a.registrationDate).slice(0, 6);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Хяналтын самбар</h1>
        <p className="text-sm text-muted-foreground">Системийн ерөнхий тойм</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center justify-between pt-6">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-3xl font-bold">{value}</p>
                </div>
                <div className="rounded-xl bg-primary/10 p-3 text-primary"><Icon className="h-6 w-6" /></div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="flex items-center justify-between pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Нийт орлого</p>
              <p className="text-3xl font-bold">{formatMNT(revenue)}</p>
              <p className="mt-1 text-xs text-muted-foreground">{data.payments.filter((p) => p.paymentStatus === "paid").length} төлбөр</p>
            </div>
            <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-500"><TrendingUp className="h-6 w-6" /></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Гүйлгээ</p>
              <p className="text-3xl font-bold">{data.payments.length}</p>
            </div>
            <div className="rounded-xl bg-primary/10 p-3 text-primary"><CreditCard className="h-6 w-6" /></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Сүүлийн бүртгэлүүд</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {recent.length === 0 && <p className="text-sm text-muted-foreground">Бүртгэл алга</p>}
          {recent.map((r) => (
            <div key={r.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
              <div className="min-w-0">
                <p className="truncate font-medium">{r.trainingTitle ?? "Сургалт"}</p>
                <p className="text-xs text-muted-foreground">{r.userName ?? r.userEmail ?? "Хэрэглэгч"} · {formatDate(r.registrationDate)}</p>
              </div>
              <Badge variant={r.paymentStatus === "paid" ? "success" : "warning"}>
                {r.paymentStatus === "paid" ? "Төлсөн" : "Хүлээгдэж буй"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
