"use client";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { forgotSchema, type ForgotValues } from "@/lib/validations";
import { resetPassword } from "@/services/auth.service";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotValues>({ resolver: zodResolver(forgotSchema) });

  async function onSubmit(values: ForgotValues) {
    setLoading(true);
    try {
      await resetPassword(values.email);
      setSent(true);
      toast.success("Сэргээх холбоос илгээлээ");
    } catch {
      toast.error("Алдаа гарлаа. И-мэйлээ шалгана уу.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Нууц үг сэргээх</CardTitle>
        <CardDescription>И-мэйл хаягаа оруулна уу</CardDescription>
      </CardHeader>
      <CardContent>
        {sent ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <MailCheck className="h-10 w-10 text-emerald-500" />
            <p className="text-sm text-muted-foreground">Сэргээх холбоосыг и-мэйлээр илгээлээ. Inbox-оо шалгана уу.</p>
            <Button asChild variant="outline" className="mt-2"><Link href="/login">Нэвтрэх рүү буцах</Link></Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">И-мэйл</Label>
              <Input id="email" type="email" placeholder="name@mail.com" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />} Холбоос илгээх
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              <Link href="/login" className="font-medium text-primary hover:underline">Нэвтрэх рүү буцах</Link>
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
