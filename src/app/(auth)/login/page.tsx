"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { loginSchema, type LoginValues } from "@/lib/validations";
import { loginUser } from "@/services/auth.service";

function mapAuthError(e: unknown): string {
  const msg = e instanceof Error ? e.message : "";
  const lower = msg.toLowerCase();
  if (lower.includes("invalid login credentials")) return "И-мэйл эсвэл нууц үг буруу";
  if (lower.includes("email not confirmed")) return "И-мэйл хаягаа баталгаажуулна уу";
  if (lower.includes("too many requests") || lower.includes("rate limit"))
    return "Хэт олон оролдлого. Түр хүлээнэ үү.";
  return msg || "Нэвтрэхэд алдаа гарлаа";
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") ?? "/dashboard";
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginValues) {
    setLoading(true);
    try {
      const user = await loginUser(values.email, values.password);
      toast.success(`Тавтай морил, ${user.name}!`);
      router.push(user.role === "admin" ? "/admin" : redirect);
    } catch (e) {
      toast.error(mapAuthError(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Нэвтрэх</CardTitle>
        <CardDescription>И-мэйл, нууц үгээ оруулна уу</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">И-мэйл</Label>
            <Input id="email" type="email" placeholder="name@mail.com" {...register("email")} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Нууц үг</Label>
              <Link href="/forgot-password" className="text-xs text-primary hover:underline">Нууц үг мартсан?</Link>
            </div>
            <Input id="password" type="password" placeholder="••••••" {...register("password")} />
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} Нэвтрэх
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Бүртгэлгүй юу?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">Бүртгүүлэх</Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
