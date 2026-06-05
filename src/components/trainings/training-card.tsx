import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin, User, Users } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatMNT } from "@/lib/utils";
import type { Training } from "@/types";

const skillLabel: Record<string, string> = {
  beginner: "Анхан шат",
  intermediate: "Дунд шат",
  advanced: "Ахисан шат",
  all: "Бүх шат",
};

export function TrainingCard({ training }: { training: Training }) {
  const full = training.currentParticipants >= training.capacity;
  return (
    <Link href={`/trainings/${training.id}`} className="group">
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
        <div className="relative h-44 w-full overflow-hidden bg-muted">
          {training.image ? (
            <Image
              src={training.image}
              alt={training.title}
              fill
              sizes="(max-width:768px) 100vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">Зураггүй</div>
          )}
          <Badge className="absolute left-3 top-3" variant="secondary">
            {skillLabel[training.skillLevel] ?? training.skillLevel}
          </Badge>
          {full && (
            <Badge className="absolute right-3 top-3" variant="destructive">
              Дүүрсэн
            </Badge>
          )}
        </div>
        <CardContent className="space-y-3 pt-4">
          <h3 className="line-clamp-1 text-base font-semibold">{training.title}</h3>
          <div className="space-y-1.5 text-sm text-muted-foreground">
            <p className="flex items-center gap-2"><User className="h-4 w-4" /> {training.coachName}</p>
            <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> {training.schedule}</p>
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {training.location}</p>
            <p className="flex items-center gap-2">
              <Users className="h-4 w-4" /> {training.currentParticipants}/{training.capacity} оролцогч
            </p>
          </div>
        </CardContent>
        <CardFooter className="justify-between border-t pt-4">
          <span className="text-lg font-bold text-primary">{formatMNT(training.price)}</span>
          <span className="text-sm font-medium text-primary group-hover:underline">Дэлгэрэнгүй →</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
