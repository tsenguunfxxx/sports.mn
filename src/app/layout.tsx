import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { AuthProvider } from "@/features/auth/auth-provider";

export const metadata: Metadata = {
  title: "Sport.mn — Монголын спорт сургалтын платформ",
  description: "Волейбол, сагсан бөмбөг болон бусад спортын сургалтад онлайнаар бүртгүүлж, төлбөрөө төлөөрэй.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
            <Toaster richColors position="top-center" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
