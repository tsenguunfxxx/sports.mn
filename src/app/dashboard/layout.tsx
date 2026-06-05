"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Ticket, CreditCard, Bell } from "lucide-react";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { SiteShell } from "@/components/layout/site-shell";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Профайл", icon: User },
  { href: "/dashboard/registrations", label: "Бүртгэлүүд", icon: Ticket },
  { href: "/dashboard/payments", label: "Төлбөрийн түүх", icon: CreditCard },
  { href: "/dashboard/notifications", label: "Мэдэгдэл", icon: Bell },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <ProtectedRoute>
      <SiteShell>
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <h1 className="mb-6 text-2xl font-bold">Миний булан</h1>
          <div className="grid gap-6 md:grid-cols-[220px_1fr]">
            <nav className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
              {NAV.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                );
              })}
            </nav>
            <div className="min-w-0">{children}</div>
          </div>
        </div>
      </SiteShell>
    </ProtectedRoute>
  );
}
