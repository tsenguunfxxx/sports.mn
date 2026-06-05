"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Dumbbell,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  Menu,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { logoutUser } from "@/services/auth.service";

const links = [
  { href: "/", label: "Нүүр" },
  { href: "/sports", label: "Спортууд" },
  { href: "/trainings", label: "Сургалтууд" },
];

export function Navbar() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logoutUser();
    toast.success("Гарлаа");
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Dumbbell className="h-5 w-5" />
          </span>
          <span className="text-lg">Sports.mn</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full p-0"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.profileImage} alt={user.name} />
                    <AvatarFallback>
                      {user.name?.[0]?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col">
                  <span>{user.name}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {user.email}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                  <LayoutDashboard className="h-4 w-4" /> Хяналтын самбар
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => router.push("/admin")}>
                    <ShieldCheck className="h-4 w-4" /> Админ
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive"
                >
                  <LogOut className="h-4 w-4" /> Гарах
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild className="hidden sm:inline-flex">
                <Link href="/login">Нэвтрэх</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Бүртгүүлэх</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
