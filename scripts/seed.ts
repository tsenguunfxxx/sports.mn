/**
 * Seed script for Sport.mn (Supabase)
 *
 * Requires (in .env.local or shell env):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   (service_role secret — bypasses RLS)
 *
 * Run AFTER applying supabase/schema.sql:
 *   npm run seed
 *
 * Optional: SEED_ADMIN_EMAIL — promote an already-registered user to admin.
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const db = createClient(url, serviceKey, { auth: { persistSession: false } });

const sports = [
  {
    name: "Волейбол",
    icon: "Volleyball",
    image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1200&q=80",
    description: "Багийн волейболын сургалт — техник, тактик, бие бялдрын бэлтгэл.",
    active: true,
  },
  {
    name: "Сагсан бөмбөг",
    icon: "Dribbble",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80",
    description: "Сагсан бөмбөгийн анхан болон ахисан түвшний дасгалжуулалт.",
    active: true,
  },
];

type SeedTraining = {
  title: string;
  description: string;
  coach_name: string;
  coach_image: string;
  location: string;
  schedule: string;
  duration: string;
  age_group: string;
  skill_level: "beginner" | "intermediate" | "advanced" | "all";
  capacity: number;
  price: number;
  image: string;
  active: boolean;
};

const trainingsBySport: Record<string, SeedTraining[]> = {
  Волейбол: [
    {
      title: "Волейбол — Анхан шатны сургалт",
      description:
        "Волейболын үндсэн техник (дамжуулалт, өргөлт, довтолгоо)-ийг эхнээс нь сурна. Туршлагатай дасгалжуулагч хичээлийг удирдана.",
      coach_name: "Б. Болормаа",
      coach_image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
      location: "Улаанбаатар, СБД, Спорт ордон",
      schedule: "Да, Лха, Ба — 18:00-19:30",
      duration: "8 долоо хоног",
      age_group: "12-17 нас",
      skill_level: "beginner",
      capacity: 20,
      price: 150000,
      image: "https://images.unsplash.com/photo-1592656094267-764a45160876?auto=format&fit=crop&w=1200&q=80",
      active: true,
    },
    {
      title: "Волейбол — Ахисан түвшний бэлтгэл",
      description:
        "Тэмцээнд бэлтгэх ахисан түвшний хөтөлбөр. Тактик, багийн зохион байгуулалт, хүч чадлын бэлтгэл багтана.",
      coach_name: "Г. Энхбаатар",
      coach_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      location: "Улаанбаатар, ХУД, Буянт-Ухаа спорт цогцолбор",
      schedule: "Мя, Пү, Бя — 19:00-21:00",
      duration: "12 долоо хоног",
      age_group: "16+ нас",
      skill_level: "advanced",
      capacity: 16,
      price: 280000,
      image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1200&q=80",
      active: true,
    },
  ],
  "Сагсан бөмбөг": [
    {
      title: "Сагсан бөмбөг — Хүүхдийн анги",
      description:
        "Хүүхдэд зориулсан сагсан бөмбөгийн хөгжөөнт сургалт. Бөмбөг хөтлөх, шидэх үндсэн дадал эзэмшүүлнэ.",
      coach_name: "Д. Тэмүүлэн",
      coach_image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=400&q=80",
      location: "Улаанбаатар, БЗД, 5-р хороолол",
      schedule: "Да, Пү — 17:00-18:30",
      duration: "10 долоо хоног",
      age_group: "8-13 нас",
      skill_level: "beginner",
      capacity: 24,
      price: 120000,
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80",
      active: true,
    },
    {
      title: "Сагсан бөмбөг — Насанд хүрэгчдийн лиг бэлтгэл",
      description:
        "Сонирхогчдын лигт тоглох насанд хүрэгчдэд зориулсан бэлтгэл. Тактик, бие бялдар, тоглолтын дадлага.",
      coach_name: "С. Ариунболд",
      coach_image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      location: "Улаанбаатар, СХД, Найрамдал спорт заал",
      schedule: "Мя, Ба — 20:00-22:00",
      duration: "Тогтмол",
      age_group: "18+ нас",
      skill_level: "intermediate",
      capacity: 18,
      price: 200000,
      image: "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?auto=format&fit=crop&w=1200&q=80",
      active: true,
    },
  ],
};

async function seed() {
  console.log("Seeding sports...");
  for (const sport of sports) {
    // Upsert by name (re-runnable).
    const { data: existing } = await db.from("sports").select("id").eq("name", sport.name).maybeSingle();
    let sportId: string;
    if (existing) {
      sportId = (existing as { id: string }).id;
      await db.from("sports").update(sport).eq("id", sportId);
      console.log(`  • updated: ${sport.name}`);
    } else {
      const { data, error } = await db.from("sports").insert(sport).select("id").single();
      if (error) throw error;
      sportId = (data as { id: string }).id;
      console.log(`  ✓ ${sport.name}`);
    }

    const trainings = trainingsBySport[sport.name] ?? [];
    for (const t of trainings) {
      const { data: exists } = await db.from("trainings").select("id").eq("title", t.title).maybeSingle();
      if (exists) {
        console.log(`    • skipped (exists): ${t.title}`);
        continue;
      }
      const { error } = await db.from("trainings").insert({ ...t, sport_id: sportId, current_participants: 0 });
      if (error) throw error;
      console.log(`    ✓ ${t.title}`);
    }
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  if (adminEmail) {
    const { data: list, error } = await db.auth.admin.listUsers();
    if (error) {
      console.warn("Could not list users to promote admin:", error.message);
    } else {
      const found = list.users.find((u) => u.email?.toLowerCase() === adminEmail.toLowerCase());
      if (found) {
        await db.from("profiles").update({ role: "admin" }).eq("id", found.id);
        console.log(`Promoted ${adminEmail} to admin.`);
      } else {
        console.warn(`User ${adminEmail} not found. Register first, then re-run.`);
      }
    }
  }

  console.log("Seed complete.");
}

seed()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
