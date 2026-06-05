"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { registerSchema, type RegisterValues } from "@/lib/validations";
import { registerUser } from "@/services/auth.service";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterValues) {
    setLoading(true);
    try {
      await registerUser({ name: values.name, email: values.email, phone: values.phone, password: values.password });
      toast.success("Амжилттай бүртгүүллээ!");
      router.push("/dashboard");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      const low = msg.toLowerCase();
      toast.error(low.includes("already registered") || low.includes("already been registered") ? "Энэ и-мэйл бүртгэлтэй байна" : "Бүртгэлд алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Бүртгүүлэх</CardTitle>
        <CardDescription>Шинэ бүртгэл үүсгэнэ үү</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Нэр</Label>
            <Input id="name" placeholder="Бат-Эрдэнэ" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">И-мэйл</Label>
            <Input id="email" type="email" placeholder="name@mail.com" {...register("email")} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Утас</Label>
            <Input id="phone" placeholder="99112233" {...register("phone")} />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="password">Нууц үг</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Давтах</Label>
              <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
              {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} Бүртгүүлэх
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Бүртгэлтэй юу?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">Нэвтрэх</Link>
        </p>
      </CardContent>
    </Card>
  );
}
