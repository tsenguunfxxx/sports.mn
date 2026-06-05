"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { getUserProfile } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    let active = true;

    async function loadFromSession(userId: string | undefined) {
      if (!userId) {
        if (active) setUser(null);
        return;
      }
      try {
        const profile = await getUserProfile(userId);
        if (active) setUser(profile);
      } catch {
        if (active) setUser(null);
      }
    }

    // Initial session load.
    supabase.auth.getSession().then(async ({ data }) => {
      await loadFromSession(data.session?.user?.id);
      if (active) setLoading(false);
    });

    // React to future auth changes.
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setLoading(true);
      await loadFromSession(session?.user?.id);
      if (active) setLoading(false);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [setUser, setLoading]);

  return <>{children}</>;
}
