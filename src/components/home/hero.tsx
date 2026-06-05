"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const popular = ["Волейбол", "Сагсан бөмбөг", "Анхан шат", "Хүүхэд"];

export function Hero() {
  const [q, setQ] = useState("");
  const router = useRouter();

  function search() {
    const params = new URLSearchParams();
    if (q.trim()) params.set("search", q.trim());
    router.push(`/trainings?${params.toString()}`);
  }

  return (
    <section className="relative overflow-hidden border-b">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/15 via-background to-background" />
      <div className="container flex flex-col items-center py-20 text-center md:py-28">
        <span className="mb-4 rounded-full border bg-background px-4 py-1.5 text-sm font-medium text-muted-foreground">
          🏐 Монголын спорт сургалтын платформ
        </span>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
          Тохирох <span className="text-primary">спорт сургалтаа</span> олоорой
        </h1>
        <p className="mt-5 max-w-xl text-muted-foreground md:text-lg">
          Волейбол, сагсан бөмбөг болон бусад спортын сургалтуудаас сонгож, онлайнаар бүртгүүлээрэй.
        </p>

        <div className="mt-8 flex w-full max-w-xl items-center gap-2 rounded-xl border bg-background p-2 shadow-sm">
          <Search className="ml-2 h-5 w-5 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder="Сургалт, дасгалжуулагч хайх..."
            className="border-0 shadow-none focus-visible:ring-0"
          />
          <Button onClick={search}>Хайх</Button>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">Түгээмэл:</span>
          {popular.map((p) => (
            <button
              key={p}
              onClick={() => router.push(`/trainings?search=${encodeURIComponent(p)}`)}
              className="rounded-full border bg-background px-3 py-1 text-sm transition-colors hover:bg-accent"
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
