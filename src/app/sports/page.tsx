"use client";
import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { Card } from "@/components/ui/card";
import { SportIcon } from "@/components/shared/sport-icon";
import { TrainingGridSkeleton } from "@/components/shared/loaders";
import { EmptyState } from "@/components/shared/empty-state";
import { getSports } from "@/services/sports.service";
import { useAsync } from "@/hooks/use-async";

export default function SportsPage() {
  const { data, loading } = useAsync(() => getSports(true), []);

  return (
    <SiteShell>
      <div className="container py-12">
        <h1 className="text-3xl font-bold">Спортын төрлүүд</h1>
        <p className="mt-2 text-muted-foreground">Спортоо сонгож сургалтуудыг нь үзээрэй</p>
        <div className="mt-8">
          {loading ? (
            <TrainingGridSkeleton count={4} />
          ) : !data?.length ? (
            <EmptyState title="Спорт олдсонгүй" />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.map((s) => (
                <Link key={s.id} href={`/trainings?sportId=${s.id}`}>
                  <Card className="flex items-center gap-4 p-6 transition-all hover:shadow-md">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <SportIcon name={s.icon} className="h-7 w-7" />
                    </span>
                    <div>
                      <h3 className="font-semibold">{s.name}</h3>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{s.description}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </SiteShell>
  );
}
