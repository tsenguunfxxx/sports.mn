"use client";
import { UserCog } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { TrainingGridSkeleton } from "@/components/shared/loaders";
import { useAsync } from "@/hooks/use-async";
import { getTrainings } from "@/services/trainings.service";

interface Coach {
  name: string;
  image?: string;
  trainings: string[];
}

export default function AdminCoachesPage() {
  const { data, loading, error, reload } = useAsync(() => getTrainings({}, false), []);

  const coaches: Coach[] = [];
  if (data) {
    const map = new Map<string, Coach>();
    for (const t of data) {
      const key = t.coachName.trim();
      if (!key) continue;
      const existing = map.get(key);
      if (existing) {
        existing.trainings.push(t.title);
        if (!existing.image && t.coachImage) existing.image = t.coachImage;
      } else {
        map.set(key, { name: key, image: t.coachImage, trainings: [t.title] });
      }
    }
    coaches.push(...map.values());
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Дасгалжуулагчид</h1>
        <p className="text-sm text-muted-foreground">Сургалтаас үүсгэсэн дасгалжуулагчдын жагсаалт</p>
      </div>

      {loading ? (
        <TrainingGridSkeleton count={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : coaches.length === 0 ? (
        <EmptyState icon={UserCog} title="Дасгалжуулагч алга" description="Сургалт нэмэхэд дасгалжуулагчид энд харагдана." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coaches.map((c) => (
            <Card key={c.name}>
              <CardContent className="flex items-center gap-4 pt-6">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={c.image} alt={c.name} />
                  <AvatarFallback className="text-lg">{c.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-semibold">{c.name}</p>
                  <Badge variant="secondary">{c.trainings.length} сургалт</Badge>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{c.trainings.join(", ")}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
