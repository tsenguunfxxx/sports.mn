"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { FullPageLoader } from "./loaders";

export function ProtectedRoute({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
    } else if (adminOnly && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [user, loading, isAdmin, adminOnly, router]);

  if (loading || !user || (adminOnly && !isAdmin)) return <FullPageLoader />;
  return <>{children}</>;
}
