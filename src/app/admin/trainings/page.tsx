"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { TableSkeleton } from "@/components/shared/loaders";
import { useAsync } from "@/hooks/use-async";
import { getTrainings, createTraining, updateTraining, deleteTraining } from "@/services/trainings.service";
import { getSports } from "@/services/sports.service";
import { uploadImage } from "@/services/storage.service";
import { trainingSchema, type TrainingValues } from "@/lib/validations";
import { formatMNT } from "@/lib/utils";
import type { Training, SkillLevel } from "@/types";

const SKILLS: { value: SkillLevel; label: string }[] = [
  { value: "beginner", label: "Анхан шат" },
  { value: "intermediate", label: "Дунд шат" },
  { value: "advanced", label: "Ахисан шат" },
  { value: "all", label: "Бүх шат" },
];

export default function AdminTrainingsPage() {
  const { data, loading, error, reload } = useAsync(() => getTrainings({}, false), []);
  const { data: sports } = useAsync(() => getSports(false), []);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Training | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const {
    register, handleSubmit, reset, setValue, watch,
    formState: { errors },
  } = useForm<TrainingValues>({ resolver: zodResolver(trainingSchema) });
  const image = watch("image");
  const sportId = watch("sportId");
  const skillLevel = watch("skillLevel");
  const active = watch("active");

  function openCreate() {
    setEditing(null);
    reset({
      sportId: "", title: "", description: "", coachName: "", coachImage: "",
      location: "", schedule: "", duration: "", ageGroup: "", skillLevel: "all",
      capacity: 20, price: 0, image: "", active: true,
    });
    setOpen(true);
  }
  function openEdit(t: Training) {
    setEditing(t);
    reset({
      sportId: t.sportId, title: t.title, description: t.description, coachName: t.coachName,
      coachImage: t.coachImage ?? "", location: t.location, schedule: t.schedule, duration: t.duration,
      ageGroup: t.ageGroup, skillLevel: t.skillLevel, capacity: t.capacity, price: t.price,
      image: t.image, active: t.active,
    });
    setOpen(true);
  }

  async function onImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, "trainings");
      setValue("image", url, { shouldValidate: true });
      toast.success("Зураг хуулагдлаа");
    } catch {
      toast.error("Зураг хуулахад алдаа гарлаа");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(values: TrainingValues) {
    setSaving(true);
    try {
      if (editing) {
        await updateTraining(editing.id, values);
        toast.success("Сургалт шинэчлэгдлээ");
      } else {
        await createTraining(values);
        toast.success("Сургалт нэмэгдлээ");
      }
      setOpen(false);
      reload();
    } catch {
      toast.error("Алдаа гарлаа");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Энэ сургалтыг устгах уу?")) return;
    setDeleting(id);
    try {
      await deleteTraining(id);
      toast.success("Устгагдлаа");
      reload();
    } catch {
      toast.error("Устгахад алдаа гарлаа");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Сургалтууд</h1>
          <p className="text-sm text-muted-foreground">Сургалтын хөтөлбөрүүдийг удирдах</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Сургалт нэмэх</Button>
      </div>

      {loading ? (
        <TableSkeleton rows={5} />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : !data || data.length === 0 ? (
        <EmptyState icon={Plus} title="Сургалт алга" description="Эхний сургалтаа нэмнэ үү." actionLabel="Сургалт нэмэх" onAction={openCreate} />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Гарчиг</TableHead>
                  <TableHead>Дасгалжуулагч</TableHead>
                  <TableHead>Үнэ</TableHead>
                  <TableHead>Багтаамж</TableHead>
                  <TableHead>Төлөв</TableHead>
                  <TableHead className="text-right">Үйлдэл</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.title}</TableCell>
                    <TableCell>{t.coachName}</TableCell>
                    <TableCell>{formatMNT(t.price)}</TableCell>
                    <TableCell>{t.currentParticipants}/{t.capacity}</TableCell>
                    <TableCell><Badge variant={t.active ? "success" : "secondary"}>{t.active ? "Идэвхтэй" : "Идэвхгүй"}</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(t)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => onDelete(t.id)} disabled={deleting === t.id}>
                          {deleting === t.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Сургалт засах" : "Сургалт нэмэх"}</DialogTitle>
            <DialogDescription>Сургалтын дэлгэрэнгүй мэдээлэл</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Спорт</Label>
                <Select value={sportId} onValueChange={(v) => setValue("sportId", v, { shouldValidate: true })}>
                  <SelectTrigger><SelectValue placeholder="Спорт сонгох" /></SelectTrigger>
                  <SelectContent>
                    {(sports ?? []).map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.sportId && <p className="text-xs text-destructive">{errors.sportId.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Түвшин</Label>
                <Select value={skillLevel} onValueChange={(v) => setValue("skillLevel", v as SkillLevel, { shouldValidate: true })}>
                  <SelectTrigger><SelectValue placeholder="Түвшин" /></SelectTrigger>
                  <SelectContent>
                    {SKILLS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Гарчиг</Label>
              <Input id="title" {...register("title")} />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Тайлбар</Label>
              <Textarea id="description" rows={3} {...register("description")} />
              {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="coachName">Дасгалжуулагч</Label>
                <Input id="coachName" {...register("coachName")} />
                {errors.coachName && <p className="text-xs text-destructive">{errors.coachName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="coachImage">Дасгалжуулагчийн зураг (URL)</Label>
                <Input id="coachImage" placeholder="https://..." {...register("coachImage")} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">Байршил</Label>
                <Input id="location" {...register("location")} />
                {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule">Хуваарь</Label>
                <Input id="schedule" placeholder="Да, Лх, Ба 18:00" {...register("schedule")} />
                {errors.schedule && <p className="text-xs text-destructive">{errors.schedule.message}</p>}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="duration">Үргэлжлэх</Label>
                <Input id="duration" placeholder="8 долоо хоног" {...register("duration")} />
                {errors.duration && <p className="text-xs text-destructive">{errors.duration.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="ageGroup">Нас</Label>
                <Input id="ageGroup" placeholder="12-16 нас" {...register("ageGroup")} />
                {errors.ageGroup && <p className="text-xs text-destructive">{errors.ageGroup.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Багтаамж</Label>
                <Input id="capacity" type="number" {...register("capacity")} />
                {errors.capacity && <p className="text-xs text-destructive">{errors.capacity.message}</p>}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Үнэ (₮)</Label>
                <Input id="price" type="number" {...register("price")} />
                {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Зураг</Label>
                <div className="flex gap-2">
                  <Input placeholder="https://..." {...register("image")} />
                  <Button type="button" variant="outline" size="icon" disabled={uploading} onClick={() => document.getElementById("tImg")?.click()}>
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  </Button>
                  <input id="tImg" type="file" accept="image/*" className="hidden" onChange={onImage} />
                </div>
                {errors.image && <p className="text-xs text-destructive">{errors.image.message}</p>}
              </div>
            </div>
            {image && <img src={image} alt="preview" className="h-32 w-full rounded-lg object-cover" />}
            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label htmlFor="tactive">Идэвхтэй эсэх</Label>
              <Switch id="tactive" checked={active} onCheckedChange={(v) => setValue("active", v)} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Болих</Button>
              <Button type="submit" disabled={saving}>{saving && <Loader2 className="h-4 w-4 animate-spin" />} Хадгалах</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
