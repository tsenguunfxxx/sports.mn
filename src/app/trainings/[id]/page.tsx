"use client";
import { use } from "react";
import Image from "next/image";
import { CalendarDays, Clock, MapPin, Users, BarChart3, Baby } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RegisterButton } from "@/components/trainings/register-button";
import { FullPageLoader } from "@/components/shared/loaders";
import { EmptyState } from "@/components/shared/empty-state";
import { getTraining } from "@/services/trainings.service";
import { useAsync } from "@/hooks/use-async";
import { formatMNT } from "@/lib/utils";

const skillLabel: Record<string, string> = {
  beginner: "Анхан шат",
  intermediate: "Дунд шат",
  advanced: "Ахисан шат",
  all: "Бүх шат",
};

export default function TrainingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: t, loading } = useAsync(() => getTraining(id), [id]);

  return (
    <SiteShell>
      <div className="container py-10">
        {loading ? (
          <FullPageLoader />
        ) : !t ? (
          <EmptyState title="Сургалт олдсонгүй" description="Энэ сургалт устсан эсвэл байхгүй байна." />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="space-y-6">
              <div className="relative h-72 w-full overflow-hidden rounded-2xl bg-muted md:h-96">
                {t.image && <Image src={t.image} alt={t.title} fill sizes="100vw" className="object-cover" />}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{skillLabel[t.skillLevel]}</Badge>
                  <Badge variant="outline">{t.ageGroup}</Badge>
                </div>
                <h1 className="mt-3 text-3xl font-bold">{t.title}</h1>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <Info icon={<CalendarDays className="h-5 w-5" />} label="Хуваарь" value={t.schedule} />
                <Info icon={<Clock className="h-5 w-5" />} label="Үргэлжлэх" value={t.duration} />
                <Info icon={<MapPin className="h-5 w-5" />} label="Байршил" value={t.location} />
                <Info icon={<Baby className="h-5 w-5" />} label="Насны бүлэг" value={t.ageGroup} />
                <Info icon={<BarChart3 className="h-5 w-5" />} label="Түвшин" value={skillLabel[t.skillLevel]} />
                <Info icon={<Users className="h-5 w-5" />} label="Оролцогч" value={`${t.currentParticipants}/${t.capacity}`} />
              </div>

              <Separator />
              <div>
                <h2 className="mb-2 text-xl font-semibold">Тайлбар</h2>
                <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{t.description}</p>
              </div>

              <Separator />
              <div>
                <h2 className="mb-3 text-xl font-semibold">Дасгалжуулагч</h2>
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={t.coachImage} alt={t.coachName} />
                    <AvatarFallback>{t.coachName?.[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{t.coachName}</p>
                    <p className="text-sm text-muted-foreground">Мэргэшсэн дасгалжуулагч</p>
                  </div>
                </div>
              </div>
            </div>

            <aside className="lg:sticky lg:top-20 lg:h-fit">
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Сургалтын төлбөр</p>
                    <p className="text-3xl font-bold text-primary">{formatMNT(t.price)}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Үлдсэн суудал</span>
                      <span className="font-medium">{Math.max(0, t.capacity - t.currentParticipants)}</span>
                    </div>
                  </div>
                  <RegisterButton training={t} />
                  <p className="text-center text-xs text-muted-foreground">Бүртгүүлсний дараа төлбөрийн хуудас руу шилжинэ</p>
                </CardContent>
              </Card>
            </aside>
          </div>
        )}
      </div>
    </SiteShell>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border p-3">
      <span className="text-primary">{icon}</span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
