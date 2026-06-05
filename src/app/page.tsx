"use client";
import { SiteShell } from "@/components/layout/site-shell";
import { Hero } from "@/components/home/hero";
import { SportsGrid } from "@/components/home/sports-grid";
import { FeaturedTrainings } from "@/components/home/featured-trainings";
import { TrainingGridSkeleton } from "@/components/shared/loaders";
import { getSports } from "@/services/sports.service";
import { getFeaturedTrainings } from "@/services/trainings.service";
import { useAsync } from "@/hooks/use-async";

export default function HomePage() {
  const sports = useAsync(() => getSports(true), []);
  const featured = useAsync(() => getFeaturedTrainings(6), []);

  return (
    <SiteShell>
      <Hero />
      {sports.loading ? (
        <div className="container py-16">
          <TrainingGridSkeleton count={4} />
        </div>
      ) : (
        <SportsGrid sports={sports.data ?? []} />
      )}
      {featured.loading ? (
        <div className="container py-16">
          <TrainingGridSkeleton count={6} />
        </div>
      ) : (
        <FeaturedTrainings trainings={featured.data ?? []} />
      )}
    </SiteShell>
  );
}
