"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { SportIcon } from "@/components/shared/sport-icon";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { TableSkeleton } from "@/components/shared/loaders";
import { useAsync } from "@/hooks/use-async";
import { getSports, createSport, updateSport, deleteSport } from "@/services/sports.service";
import { sportSchema, type SportValues } from "@/lib/validations";
import type { Sport } from "@/types";

export default function AdminSportsPage() {
  const { data, loading, error, reload } = useAsync(() => getSports(false), []);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Sport | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const {
    register, handleSubmit, reset, setValue, watch,
    formState: { errors },
  } = useForm<SportValues>({ resolver: zodResolver(sportSchema) });
  const active = watch("active");

  function openCreate() {
    setEditing(null);
    reset({ name: "", icon: "Volleyball", description: "", image: "", active: true });
    setOpen(true);
  }
  function openEdit(s: Sport) {
    setEditing(s);
    reset({ name: s.name, icon: s.icon, description: s.description, image: s.image, active: s.active });
    setOpen(true);
  }

  async function onSubmit(values: SportValues) {
    setSaving(true);
    try {
      if (editing) {
        await updateSport(editing.id, values);
        toast.success("Спорт шинэчлэгдлээ");
      } else {
        await createSport(values);
        toast.success("Спорт нэмэгдлээ");
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
    if (!confirm("Энэ спортыг устгах уу?")) return;
    setDeleting(id);
    try {
      await deleteSport(id);
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
          <h1 className="text-2xl font-bold">Спортууд</h1>
          <p className="text-sm text-muted-foreground">Спортын төрлүүдийг удирдах</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Спорт нэмэх</Button>
      </div>

      {loading ? (
        <TableSkeleton rows={4} />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : !data || data.length === 0 ? (
        <EmptyState icon={Plus} title="Спорт алга" description="Эхний спортоо нэмнэ үү." actionLabel="Спорт нэмэх" onAction={openCreate} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((s) => (
            <Card key={s.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-primary/10 p-3 text-primary"><SportIcon name={s.icon} className="h-6 w-6" /></div>
                    <div>
                      <p className="font-semibold">{s.name}</p>
                      <Badge variant={s.active ? "success" : "secondary"}>{s.active ? "Идэвхтэй" : "Идэвхгүй"}</Badge>
                    </div>
                  </div>
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{s.description}</p>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(s)}><Pencil className="h-3.5 w-3.5" /> Засах</Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => onDelete(s.id)} disabled={deleting === s.id}>
                    {deleting === s.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />} Устгах
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Спорт засах" : "Спорт нэмэх"}</DialogTitle>
            <DialogDescription>Спортын мэдээллийг бөглөнө үү</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Нэр</Label>
              <Input id="name" placeholder="Волейбол" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Icon нэр (lucide)</Label>
              <Input id="icon" placeholder="Volleyball" {...register("icon")} />
              {errors.icon && <p className="text-xs text-destructive">{errors.icon.message}</p>}
              <p className="text-xs text-muted-foreground">Жишээ: Volleyball, Dribbble, Dumbbell</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Зургийн URL</Label>
              <Input id="image" placeholder="https://..." {...register("image")} />
              {errors.image && <p className="text-xs text-destructive">{errors.image.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Тайлбар</Label>
              <Textarea id="description" rows={3} {...register("description")} />
              {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label htmlFor="active">Идэвхтэй эсэх</Label>
              <Switch id="active" checked={active} onCheckedChange={(v) => setValue("active", v)} />
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
