"use client";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Camera, Mail, Phone, Shield } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { useAuthStore } from "@/store/auth.store";
import { profileSchema, type ProfileValues } from "@/lib/validations";
import { updateUserProfile } from "@/services/users.service";
import { uploadAvatar } from "@/services/storage.service";
import { formatDate } from "@/lib/utils";

export default function ProfilePage() {
  const { user } = useAuth();
  const setUser = useAuthStore((s) => s.setUser);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    values: { name: user?.name ?? "", phone: user?.phone ?? "" },
  });

  if (!user) return null;

  async function onSubmit(values: ProfileValues) {
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile(user.id, values);
      setUser({ ...user, ...values });
      toast.success("Профайл шинэчлэгдлээ");
    } catch {
      toast.error("Хадгалахад алдаа гарлаа");
    } finally {
      setSaving(false);
    }
  }

  async function onAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const url = await uploadAvatar(file, user.id);
      await updateUserProfile(user.id, { profileImage: url });
      setUser({ ...user, profileImage: url });
      toast.success("Зураг шинэчлэгдлээ");
    } catch {
      toast.error("Зураг хуулахад алдаа гарлаа");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex flex-col items-center gap-4 pt-6 sm:flex-row sm:items-center">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.profileImage} alt={user.name} />
              <AvatarFallback className="text-xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow"
            >
              {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onAvatar} />
          </div>
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <h2 className="text-xl font-semibold">{user.name}</h2>
              {user.role === "admin" && (
                <Badge variant="secondary"><Shield className="mr-1 h-3 w-3" />Админ</Badge>
              )}
            </div>
            <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
              <Mail className="h-3.5 w-3.5" /> {user.email}
            </p>
            <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
              <Phone className="h-3.5 w-3.5" /> {user.phone || "—"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Бүртгүүлсэн: {formatDate(user.createdAt)}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Мэдээлэл засах</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Нэр</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Утас</Label>
              <Input id="phone" {...register("phone")} />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>И-мэйл</Label>
              <Input value={user.email} disabled />
              <p className="text-xs text-muted-foreground">И-мэйл хаягийг өөрчлөх боломжгүй</p>
            </div>
            <Button type="submit" disabled={saving || !isDirty}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />} Хадгалах
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
