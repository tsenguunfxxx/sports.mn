import Link from "next/link";
import { Dumbbell, Facebook, Instagram, Twitter, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container grid gap-8 py-12 md:grid-cols-4">
        <div className="space-y-3">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Dumbbell className="h-4 w-4" />
            </span>
            Sport.mn
          </Link>
          <p className="text-sm text-muted-foreground">Монголын спорт сургалтын нэгдсэн платформ.</p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Холбоосууд</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/sports" className="hover:text-foreground">Спортууд</Link></li>
            <li><Link href="/trainings" className="hover:text-foreground">Сургалтууд</Link></li>
            <li><Link href="/register" className="hover:text-foreground">Бүртгүүлэх</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Холбоо барих</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +976 7000-0000</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> info@sport.mn</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Сошиал</h4>
          <div className="flex gap-3 text-muted-foreground">
            <Link href="#" aria-label="Facebook" className="hover:text-foreground"><Facebook className="h-5 w-5" /></Link>
            <Link href="#" aria-label="Instagram" className="hover:text-foreground"><Instagram className="h-5 w-5" /></Link>
            <Link href="#" aria-label="Twitter" className="hover:text-foreground"><Twitter className="h-5 w-5" /></Link>
          </div>
        </div>
      </div>
      <div className="border-t py-4">
        <div className="container flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} Sport.mn. Бүх эрх хуулиар хамгаалагдсан.</span>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-foreground">Үйлчилгээний нөхцөл</Link>
            <Link href="#" className="hover:text-foreground">Нууцлалын бодлого</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
