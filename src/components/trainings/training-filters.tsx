"use client";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Sport, TrainingFilters } from "@/types";

export function TrainingFiltersPanel({
  sports,
  filters,
  onChange,
  onReset,
}: {
  sports: Sport[];
  filters: TrainingFilters;
  onChange: (f: Partial<TrainingFilters>) => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-5 rounded-xl border p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Шүүлтүүр</h3>
        <Button variant="ghost" size="sm" onClick={onReset} className="h-7 text-xs">
          <X className="h-3 w-3" /> Цэвэрлэх
        </Button>
      </div>

      <div className="space-y-2">
        <Label>Хайлт</Label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Гарчиг / тайлбар"
            value={filters.search ?? ""}
            onChange={(e) => onChange({ search: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Спорт</Label>
        <Select value={filters.sportId ?? "all"} onValueChange={(v) => onChange({ sportId: v === "all" ? undefined : v })}>
          <SelectTrigger><SelectValue placeholder="Бүх спорт" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Бүх спорт</SelectItem>
            {sports.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Дасгалжуулагч</Label>
        <Input placeholder="Нэр" value={filters.coach ?? ""} onChange={(e) => onChange({ coach: e.target.value })} />
      </div>

      <div className="space-y-2">
        <Label>Байршил</Label>
        <Input placeholder="Дүүрэг / заал" value={filters.location ?? ""} onChange={(e) => onChange({ location: e.target.value })} />
      </div>

      <div className="space-y-2">
        <Label>Түвшин</Label>
        <Select value={filters.skillLevel ?? "all"} onValueChange={(v) => onChange({ skillLevel: v as TrainingFilters["skillLevel"] })}>
          <SelectTrigger><SelectValue placeholder="Бүх түвшин" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Бүх түвшин</SelectItem>
            <SelectItem value="beginner">Анхан шат</SelectItem>
            <SelectItem value="intermediate">Дунд шат</SelectItem>
            <SelectItem value="advanced">Ахисан шат</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <Label>Доод үнэ</Label>
          <Input
            type="number"
            placeholder="0"
            value={filters.minPrice ?? ""}
            onChange={(e) => onChange({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>
        <div className="space-y-2">
          <Label>Дээд үнэ</Label>
          <Input
            type="number"
            placeholder="∞"
            value={filters.maxPrice ?? ""}
            onChange={(e) => onChange({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>
      </div>
    </div>
  );
}
