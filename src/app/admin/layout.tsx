"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Dumbbell, GraduationCap, Users, Ticket, CreditCard,
  UserCog, Settings, Menu, X, LogOut, Home,
} from "lucide-react";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useUIStore } from "@/store/ui.store";
import { logoutUser } from "@/services/auth.service";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Хяналтын самбар", icon: LayoutDashboard },
  { href: "/admin/sports", label: "Спортууд", icon: Dumbbell },
  { href: "/admin/trainings", label: "Сургалтууд", icon: GraduationCap },
  { href: "/admin/coaches", label: "Дасгалжуулагчид", icon: UserCog },
  { href: "/admin/users", label: "Хэрэглэгчид", icon: Users },
  { href: "/admin/registrations", label: "Бүртгэлүүд", icon: Ticket },
  { href: "/admin/payments", label: "Төлбөрүүд", icon: CreditCard },
  { href: "/admin/settings", label: "Тохиргоо", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const toggle = useUIStore((s) => s.toggleSidebar);
  const setSidebar = useUIStore((s) => s.setSidebar);

  async function handleLogout() {
    await logoutUser();
    router.push("/");
  }

  return (
    <ProtectedRoute adminOnly>
      <div className="flex min-h-screen bg-muted/30">
        {sidebarOpen && (
          <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setSidebar(false)} />
        )}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-background transition-transform md:static md:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-16 items-center justify-between border-b px-5">
            <Link href="/admin" className="flex items-center gap-2 font-bold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Dumbbell className="h-4 w-4" />
              </span>
              Sport.mn
            </Link>
            <button className="md:hidden" onClick={() => setSidebar(false)}><X className="h-5 w-5" /></button>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto p-3">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setSidebar(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="space-y-1 border-t p-3">
            <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted">
              <Home className="h-4 w-4" /> Нүүр хуудас
            </Link>
            <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10">
              <LogOut className="h-4 w-4" /> Гарах
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:px-6">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggle}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex-1" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-x-hidden p-4 md:p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
