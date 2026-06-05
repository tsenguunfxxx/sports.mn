"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { TrainingCard } from "@/components/trainings/training-card";
import { TrainingFiltersPanel } from "@/components/trainings/training-filters";
import { TrainingGridSkeleton } from "@/components/shared/loaders";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { getSports } from "@/services/sports.service";
import { getTrainings } from "@/services/trainings.service";
import { useUIStore } from "@/store/ui.store";
import { useAsync } from "@/hooks/use-async";
import type { Sport } from "@/types";

function TrainingsInner() {
  const params = useSearchParams();
  const { filters, setFilters, resetFilters } = useUIStore();
  const [sports, setSports] = useState<Sport[]>([]);

  useEffect(() => {
    getSports(true).then(setSports);
  }, []);

  // Seed filters from URL on first mount.
  useEffect(() => {
    const sportId = params.get("sportId") ?? undefined;
    const search = params.get("search") ?? undefined;
    if (sportId || search) setFilters({ sportId, search });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const key = useMemo(() => JSON.stringify(filters), [filters]);
  const { data, loading, error, reload } = useAsync(() => getTrainings(filters, true), [key]);

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold">Сургалтууд</h1>
      <p className="mt-2 text-muted-foreground">Хайж, шүүж тохирох сургалтаа олоорой</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <TrainingFiltersPanel sports={sports} filters={filters} onChange={setFilters} onReset={resetFilters} />
        </aside>

        <div>
          {loading ? (
            <TrainingGridSkeleton />
          ) : error ? (
            <ErrorState message={error} onRetry={reload} />
          ) : !data?.length ? (
            <EmptyState title="Сургалт олдсонгүй" description="Шүүлтүүрээ өөрчилж дахин оролдоно уу." actionLabel="Цэвэрлэх" onAction={resetFilters} />
          ) : (
            <>
              <p className="mb-4 text-sm text-muted-foreground">{data.length} сургалт олдлоо</p>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {data.map((t) => (
                  <TrainingCard key={t.id} training={t} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TrainingsPage() {
  return (
    <SiteShell>
      <Suspense fallback={<div className="container py-10"><TrainingGridSkeleton /></div>}>
        <TrainingsInner />
      </Suspense>
    </SiteShell>
  );
}
