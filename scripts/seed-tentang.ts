import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { siteSettings, tentangOrgMembers, tentangTimelineEvents } from "../src/db/schema";
import { eq } from "drizzle-orm";
import "dotenv/config";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql, schema: { siteSettings, tentangOrgMembers, tentangTimelineEvents } });

const settings = [
  {
    key: "tentang_hero_desc",
    value: "Mewujudkan Digital Stewardship: Memadukan nilai tradisional dengan tata kelola modern untuk kesejahteraan seluruh warga.",
  },
  {
    key: "tentang_village_area",
    value: "1.250 Ha",
  },
  {
    key: "tentang_village_year",
    value: "1824",
  },
  {
    key: "tentang_village_population",
    value: "1234 jiwa",
  },
];

const orgMembers = [
  {
    name: "Bpk. Ahmad Subarjo",
    role: "Kepala Desa",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuACbovTfhJi7W1B9bKN3_mAgHlK-MY48ucCTDUfEBS8mGMUNQ13-h_boGePdDiAxdESklPVnK_9NFQB5pOL18J_dDHtDN3CFTlzqkoLxWGtC5_3GGqdNr6ZWJK9-0Zy7yDkJVapo1fR3i19EfSZ4FKhZkf4BeMp5kfAXfmzpIYX3RvKtRQ3N2g0YC7gEkN_yrY6Y6d1W-Y5jM5ZFocT7-1CHLaa6X1Eh0WjRwIYHeCx3DTGheq-6c_JAMcy9sCyEt9vn5WeLVYhsD4",
    isHead: true,
    sortOrder: 0,
  },
  {
    name: "Ibu Siti Aminah",
    role: "Sekretaris Desa",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPVZxfo__g2AocL3F4cKoC26EpbObA1J2qndoPwmE3yajDcFxzuixOF4KDwUHUPGzFYL-mvJTV7P6nvEh3bDpRXfc9adyCyWxvzH3bzyEEPvd-kINpkujqtxRWJMLtSZNL8EXDXNJlTbR6OdHULG9qcnrEUdJZOMbvjNQ_UzF9NH1i8zt9N2CVG9SIUEdcSCFo-eEp1KKqUyVlQZ0UU66TNT6TusX3XSb8L1BnZ6W17FVPkGs9oPzGnQ2OjEJt4M5KdlPqFtIbeVM",
    isHead: false,
    sortOrder: 1,
  },
  {
    name: "Bpk. Hendra Wijaya",
    role: "Bendahara Desa",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAp5IMvd35GIP0jCDWp0Ia9puHS7T9Po4W2d7233eZtEorZe6khWrPQUUIcJy6nFR3E2ps2z_6-55taJWuidCut6Cnc5KMyP-MRWXKIC86UkZ4-YW9oIomUMrN8vDJqx6tzo5Y5gSPC8bYkWp_ptRf9KLLDozukeQX3w2T2wshHKLjHDgt9EdIzBIEkw51KCbSNpQA2RPntXsfpnYSX7BzPu8PUmd9NGeaA1Hbq-5kWxEt-9TW2x4JTMDzMuDh_CozgiyeJhrmZvsY",
    isHead: false,
    sortOrder: 2,
  },
  {
    name: "Ibu Maya Lestari",
    role: "Kaur Pembangunan",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEq9Phij20MvrytHEkAmxv-R4b2A8PNukOlmQw5gWKs7bFx1DGmR6Xr7Op1n3uPMkYSa5-iUpDJmlgC79QFp3HKvPSN671ybV7ogKWGKxub_3w-PNMsHpwVUeSD3qeGt_lmBhREECxhvgQ0YthGgj9TOSPf8Cugdwk4jmZOdPd-lNi3muECkausPETS6yXunESlDVlvv__fUY6fhBWSwV3IkvtvPJ-fLMjVb36rN-JO87hEG35tvFYkaNWDGvaQZApgLeu1tLFfMo",
    isHead: false,
    sortOrder: 3,
  },
];

const timelineEvents = [
  {
    year: "1824",
    title: "Awal Pemukiman Agraris",
    description: "Didirikan oleh sekelompok pelopor petani padi yang menjunjung tinggi semangat gotong royong dan keselarasan dengan hutan tropis di sekitar lembah.",
    sortOrder: 0,
  },
  {
    year: "1945",
    title: "Integrasi Administratif",
    description: "Menyusul kemerdekaan Indonesia, desa secara resmi diakui dalam tata kelola pemerintahan kabupaten dengan nama resmi Desa Umbu Pabal (Desa Lestari).",
    sortOrder: 1,
  },
  {
    year: "2004",
    title: "Deklarasi Cagar Alam & Konservasi",
    description: "Masyarakat berkomitmen menjaga 85% wilayah sebagai hutan lindung dan menerapkan batasan ketat pembangunan demi kelestarian mata air alami.",
    sortOrder: 2,
  },
  {
    year: "2024",
    title: "Era Digital Stewardship",
    description: "Menerapkan teknologi digital, sensor IoT pertanian, dan layanan mandiri online demi efisiensi tanpa mengorbankan nilai sosial dan budaya adat.",
    sortOrder: 3,
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

  console.log("Seeding tentang_org_members...");

  const existingMembers = await db.select().from(tentangOrgMembers);
  if (existingMembers.length === 0) {
    for (const m of orgMembers) {
      await db.insert(tentangOrgMembers).values(m);
      console.log(`  + ${m.name}`);
    }
  } else {
    console.log("  = org members already exist, skipping");
  }

  console.log("Seeding tentang_timeline_events...");

  const existingEvents = await db.select().from(tentangTimelineEvents);
  if (existingEvents.length === 0) {
    for (const e of timelineEvents) {
      await db.insert(tentangTimelineEvents).values(e);
      console.log(`  + ${e.title}`);
    }
  } else {
    console.log("  = timeline events already exist, skipping");
  }

  console.log("Done!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
