"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CreditCard, Lock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { SiteShell } from "@/components/layout/site-shell";
import { FullPageLoader } from "@/components/shared/loaders";
import { ErrorState } from "@/components/shared/error-state";
import { useAuth } from "@/hooks/use-auth";
import { useAsync } from "@/hooks/use-async";
import { getRegistration } from "@/services/registrations.service";
import { processPayment } from "@/services/payments.service";
import { paymentSchema, type PaymentValues } from "@/lib/validations";
import { formatMNT } from "@/lib/utils";

function PaymentInner({ registrationId }: { registrationId: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState(false);

  const { data: reg, loading, error, reload } = useAsync(() => getRegistration(registrationId), [registrationId]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PaymentValues>({ resolver: zodResolver(paymentSchema) });

  if (loading) return <FullPageLoader />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!reg) return <ErrorState message="Бүртгэл олдсонгүй" />;

  if (reg.userId !== user?.id) return <ErrorState message="Энэ бүртгэл танд хамааралгүй байна." />;

  if (reg.paymentStatus === "paid" || done) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
        <CheckCircle2 className="h-16 w-16 text-emerald-500" />
        <h2 className="text-2xl font-bold">Төлбөр амжилттай!</h2>
        <p className="text-muted-foreground">{reg.trainingTitle} сургалтын төлбөр баталгаажлаа.</p>
        <div className="flex gap-3">
          <Button onClick={() => router.push("/dashboard/registrations")}>Миний бүртгэлүүд</Button>
          <Button variant="outline" onClick={() => router.push("/trainings")}>Сургалт үзэх</Button>
        </div>
      </div>
    );
  }

  async function onSubmit(values: PaymentValues) {
    if (!user || !reg) return;
    setPaying(true);
    try {
      await processPayment({
        user,
        trainingId: reg.trainingId,
        registrationId: reg.id,
        amount: reg.price ?? 0,
        method: "card",
        trainingTitle: reg.trainingTitle,
      });
      void values;
      setDone(true);
      toast.success("Төлбөр амжилттай төлөгдлөө");
    } catch {
      toast.error("Төлбөр төлөхөд алдаа гарлаа");
    } finally {
      setPaying(false);
    }
  }

  function formatCardNumber(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
    const grouped = digits.replace(/(.{4})/g, "$1 ").trim();
    setValue("cardNumber", grouped, { shouldValidate: true });
  }
  function formatExpiry(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
    const val = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    setValue("expiry", val, { shouldValidate: true });
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-[1fr_320px]">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" /> Картаар төлөх</CardTitle>
          <CardDescription className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5" /> Энэ бол загвар (demo) төлбөрийн систем юм
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardName">Картны эзэмшигчийн нэр</Label>
              <Input id="cardName" placeholder="BAT ERDENE" {...register("cardName")} />
              {errors.cardName && <p className="text-xs text-destructive">{errors.cardName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Картны дугаар</Label>
              <Input id="cardNumber" inputMode="numeric" placeholder="4242 4242 4242 4242" {...register("cardNumber")} onChange={formatCardNumber} />
              {errors.cardNumber && <p className="text-xs text-destructive">{errors.cardNumber.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="expiry">Хүчинтэй хугацаа</Label>
                <Input id="expiry" placeholder="MM/YY" {...register("expiry")} onChange={formatExpiry} />
                {errors.expiry && <p className="text-xs text-destructive">{errors.expiry.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" inputMode="numeric" placeholder="123" maxLength={4} {...register("cvv")} />
                {errors.cvv && <p className="text-xs text-destructive">{errors.cvv.message}</p>}
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={paying}>
              {paying && <Loader2 className="h-4 w-4 animate-spin" />}
              {formatMNT(reg.price ?? 0)} төлөх
            </Button>
            <p className="text-center text-xs text-muted-foreground">Туршилтын карт: 4242 4242 4242 4242</p>
          </form>
        </CardContent>
      </Card>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-base">Захиалгын мэдээлэл</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Сургалт</p>
            <p className="font-medium">{reg.trainingTitle ?? "Сургалт"}</p>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Нийт төлбөр</span>
            <span className="text-lg font-bold">{formatMNT(reg.price ?? 0)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentPage({ params }: { params: Promise<{ registrationId: string }> }) {
  const { registrationId } = use(params);
  return (
    <ProtectedRoute>
      <SiteShell>
        <div className="container mx-auto px-4 py-10">
          <PaymentInner registrationId={registrationId} />
        </div>
      </SiteShell>
    </ProtectedRoute>
  );
}
