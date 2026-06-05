"use client";
import { Settings, Building2, Mail, Phone, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useAuth } from "@/hooks/use-auth";

export default function AdminSettingsPage() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Тохиргоо</h1>
        <p className="text-sm text-muted-foreground">Системийн ерөнхий тохиргоо</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Building2 className="h-5 w-5" /> Байгууллагын мэдээлэл</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Нэр</Label>
              <Input defaultValue="Sport.mn" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /> Вэб</Label>
              <Input defaultValue="https://sport.mn" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> И-мэйл</Label>
              <Input defaultValue="info@sport.mn" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> Утас</Label>
              <Input defaultValue="+976 7000 0000" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Эдгээр тохиргоог хадгалахын тулд тусдаа <code>settings</code> цуглуулга үүсгэн холбоно. (Demo хувилбарт зөвхөн харагдац.)
          </p>
          <Button disabled>Хадгалах</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Settings className="h-5 w-5" /> Харагдац</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="font-medium">Загвар (Theme)</p>
              <p className="text-sm text-muted-foreground">Гэрэл / Харанхуй горим</p>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Нэвтэрсэн админ</CardTitle></CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p><span className="text-muted-foreground">Нэр:</span> {user?.name}</p>
          <Separator className="my-2" />
          <p><span className="text-muted-foreground">И-мэйл:</span> {user?.email}</p>
        </CardContent>
      </Card>
    </div>
  );
}
