import type { APIRoute } from "astro";
import { db } from "../../../db";
import { news } from "../../../db/schema";
import { auth } from "../../../lib/auth";
import { uploadImage, validateImage, deleteFile } from "../../../lib/storage";
import { eq } from "drizzle-orm";

export const prerender = false;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export const GET: APIRoute = async ({ params }) => {
  const id = Number(params.id);
  if (!id || isNaN(id)) {
    return new Response(JSON.stringify({ error: "Invalid ID" }), { status: 400 });
  }

  const [item] = await db.select().from(news).where(eq(news.id, id));

  if (!item) {
    return new Response(JSON.stringify({ error: "Berita tidak ditemukan" }), { status: 404 });
  }

  return new Response(JSON.stringify(item), {
    headers: { "Content-Type": "application/json" },
  });
};

function makeExcerpt(text: string, maxLen = 150): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trimEnd() + "...";
}

export const PUT: APIRoute = async ({ request, params }) => {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const id = Number(params.id);
  if (!id || isNaN(id)) {
    return new Response(JSON.stringify({ error: "Invalid ID" }), { status: 400 });
  }

  const [existing] = await db.select().from(news).where(eq(news.id, id));
  if (!existing) {
    return new Response(JSON.stringify({ error: "Berita tidak ditemukan" }), { status: 404 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
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

  let imageUrl = existing.image;

  if (file && file.size > 0) {
    const validation = validateImage(file);
    if (!validation.valid) {
      return new Response(JSON.stringify({ error: validation.error }), { status: 400 });
    }

    if (existing.image.includes("blob.vercel-storage.com")) {
      try {
        await deleteFile(existing.image);
      } catch {
        // Ignore deletion errors
      }
    }

    const uploaded = await uploadImage(file, "news");
    imageUrl = uploaded.url;
  }

  let slug = existing.slug;
  if (title !== existing.title) {
    slug = slugify(title);
    const allNews = await db.select().from(news);
    if (allNews.some((row: any) => row.slug === slug && row.id !== id)) {
      slug = `${slug}-${Date.now()}`;
    }
  }

  const excerpt = makeExcerpt(content);

  await db
    .update(news)
    .set({
      slug,
      image: imageUrl,
      category,
      title,
      excerpt,
      content,
    })
    .where(eq(news.id, id));

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};

export const DELETE: APIRoute = async ({ request, params }) => {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const id = Number(params.id);
  if (!id || isNaN(id)) {
    return new Response(JSON.stringify({ error: "Invalid ID" }), { status: 400 });
  }

  const [item] = await db.select().from(news).where(eq(news.id, id));

  if (!item) {
    return new Response(JSON.stringify({ error: "Berita tidak ditemukan" }), { status: 404 });
  }

  if (item.image.includes("blob.vercel-storage.com")) {
    try {
      await deleteFile(item.image);
    } catch {
      // Ignore deletion errors
    }
  }

  await db.delete(news).where(eq(news.id, id));

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
