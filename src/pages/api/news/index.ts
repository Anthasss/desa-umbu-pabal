import type { APIRoute } from "astro";
import { db } from "../../../db";
import { news } from "../../../db/schema";
import { auth } from "../../../lib/auth";
import { uploadImage, validateImage } from "../../../lib/storage";
import { desc } from "drizzle-orm";

export const prerender = false;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export const GET: APIRoute = async () => {
  const items = await db.select().from(news).orderBy(desc(news.id));
  return new Response(JSON.stringify(items), {
    headers: { "Content-Type": "application/json" },
  });
};

const INDONESIAN_MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

function formatDateID(date: Date): string {
  return `${date.getDate()} ${INDONESIAN_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

function makeExcerpt(text: string, maxLen = 150): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trimEnd() + "...";
}

export const POST: APIRoute = async ({ request }) => {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;
  const title = (formData.get("title") as string || "").trim();
  const category = (formData.get("category") as string || "").trim();
  const content = (formData.get("content") as string || "").trim();

  if (!title) {
    return new Response(JSON.stringify({ error: "Judul wajib diisi." }), { status: 400 });
  }
  if (!category) {
    return new Response(JSON.stringify({ error: "Kategori wajib diisi." }), { status: 400 });
  }
  if (!content) {
    return new Response(JSON.stringify({ error: "Konten wajib diisi." }), { status: 400 });
  }

  if (!file || file.size === 0) {
    return new Response(JSON.stringify({ error: "Gambar wajib diisi." }), { status: 400 });
  }

  const validation = validateImage(file);
  if (!validation.valid) {
    return new Response(JSON.stringify({ error: validation.error }), { status: 400 });
  }

  const { url } = await uploadImage(file, "news");

  let slug = slugify(title);
  const allNews = await db.select().from(news);
  if (allNews.some((row: any) => row.slug === slug)) {
    slug = `${slug}-${Date.now()}`;
  }

  const date = formatDateID(new Date());
  const excerpt = makeExcerpt(content);

  const [inserted] = await db
    .insert(news)
    .values({ slug, image: url, category, date, title, excerpt, content })
    .returning();

  return new Response(JSON.stringify(inserted), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};
