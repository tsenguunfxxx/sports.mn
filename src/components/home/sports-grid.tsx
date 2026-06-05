"use client";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { SportIcon } from "@/components/shared/sport-icon";
import type { Sport } from "@/types";

export function SportsGrid({ sports }: { sports: Sport[] }) {
  if (!sports.length) return null;
  return (
    <section className="container py-16">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold">Спортын төрлүүд</h2>
        <p className="mt-2 text-muted-foreground">Сонирхсон спортоо сонгож сургалтуудыг үзээрэй</p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {sports.map((s) => (
          <Link key={s.id} href={`/trainings?sportId=${s.id}`}>
            <Card className="flex flex-col items-center gap-3 p-6 text-center transition-all hover:-translate-y-1 hover:shadow-md">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <SportIcon name={s.icon} className="h-7 w-7" />
              </span>
              <h3 className="font-semibold">{s.name}</h3>
              <p className="line-clamp-2 text-xs text-muted-foreground">{s.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
