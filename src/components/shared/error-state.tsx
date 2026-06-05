"use client";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
      <div className="mb-4 rounded-full bg-destructive/10 p-4">
        <AlertTriangle className="h-7 w-7 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold">Алдаа гарлаа</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{message ?? "Дахин оролдоно уу."}</p>
      {onRetry && (
        <Button variant="outline" className="mt-4" onClick={onRetry}>
          Дахин ачаалах
        </Button>
      )}
    </div>
  );
}
