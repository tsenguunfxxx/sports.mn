import Link from "next/link";
import { Dumbbell } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <Link href="/" className="mb-8 flex items-center gap-2 text-xl font-bold">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Dumbbell className="h-5 w-5" />
        </span>
        Sport.mn
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
