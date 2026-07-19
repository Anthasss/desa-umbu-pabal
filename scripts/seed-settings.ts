import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { siteSettings, vmMissions } from "../src/db/schema";
import { eq } from "drizzle-orm";
import "dotenv/config";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql, schema: { siteSettings, vmMissions } });

const settings = [
  {
    key: "hero_title",
    value: "Membangun Masa Depan Berbasis Nilai Tradisi.",
  },
  {
    key: "hero_desc",
    value:
      "Kami berdedikasi untuk menciptakan lingkungan yang mandiri, inovatif, dan berkelanjutan bagi seluruh warga dan generasi mendatang.",
  },
  {
    key: "vhw_sambutan",
    value:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime iste dolorum deleniti voluptates harum totam perferendis libero ipsa, architecto commodi blanditiis, officia, ducimus repellat autem? Dicta vitae nam odit ipsa.",
  },
  {
    key: "vhw_kepalaDesaName",
    value: "Dr. Ir. Kepa Ladesa",
  },
  {
    key: "vhw_kepalaDesaImage",
    value:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCIVznAlW8Ze5Kwi4FmAqA4zNIZiuNkumg7gQKUmJeuDQgA3SW4KlWJR9G_h3tiwmizfL2oKEv2YybW6u9J_UEVP6noUQaegyS11uZmgsLfmGOqqZIOQTQiZJQxqW9AYVWFI5w2coNFN5H9IbZmKqJU7HpHiYba0lZ_4aE_a5E10X8As8rz61EbnO4gVq_pCth_Bd8I-fG23lsxWsraGRNSi1NFycPQ1sN5tBJ3qlGdTNz8phtVF30jweA25C36RmisiCke6S4Krn8",
  },
  {
    key: "vm_vision",
    value:
      "Menjadi desa digital percontohan nasional yang mandiri secara ekonomi, unggul dalam sumber daya manusia, dan tetap menjaga kelestarian ekosistem hutan tropis.",
  },
];

const missions = [
  {
    title: "Transformasi Digital",
    description:
      "Mengintegrasikan teknologi dalam setiap layanan administrasi dan edukasi masyarakat.",
    sortOrder: 0,
  },
  {
    title: "Pelayanan Terpadu",
    description:
      "Memberikan pelayanan yang cepat, transparan, dan mudah diakses oleh masyarakat.",
    sortOrder: 1,
  },
  {
    title: "Pemberdayaan Masyarakat",
    description:
      "Mendorong partisipasi aktif masyarakat dalam pembangunan desa.",
    sortOrder: 2,
  },
];

async function seed() {
  console.log("Seeding site_settings...");

  for (const s of settings) {
    const existing = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, s.key))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(siteSettings).values(s);
      console.log(`  + ${s.key}`);
    } else {
      console.log(`  = ${s.key} (already exists, skipping)`);
    }
  }

  console.log("Seeding vm_missions...");

  const existingMissions = await db.select().from(vmMissions);
  if (existingMissions.length === 0) {
    for (const m of missions) {
      await db.insert(vmMissions).values(m);
      console.log(`  + ${m.title}`);
    }
  } else {
    console.log("  = missions already exist, skipping");
  }

  console.log("Done!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
