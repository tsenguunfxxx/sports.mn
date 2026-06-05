import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TrainingCard } from "@/components/trainings/training-card";
import { EmptyState } from "@/components/shared/empty-state";
import type { Training } from "@/types";

export function FeaturedTrainings({ trainings }: { trainings: Training[] }) {
  return (
    <section className="bg-muted/30 py-16">
      <div className="container">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold">Онцлох сургалтууд</h2>
            <p className="mt-2 text-muted-foreground">Хамгийн сүүлд нэмэгдсэн сургалтууд</p>
          </div>
          <Button variant="outline" asChild className="hidden sm:inline-flex">
            <Link href="/trainings">Бүгдийг үзэх</Link>
          </Button>
        </div>
        {trainings.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trainings.map((t) => (
              <TrainingCard key={t.id} training={t} />
            ))}
          </div>
        ) : (
          <EmptyState title="Одоогоор сургалт алга" description="Удахгүй шинэ сургалтууд нэмэгдэнэ." />
        )}
      </div>
    </section>
  );
}
