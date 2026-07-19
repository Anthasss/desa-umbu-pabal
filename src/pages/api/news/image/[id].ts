import type { APIRoute } from "astro";
import { db } from "../../../../db";
import { news } from "../../../../db/schema";
import { downloadFile } from "../../../../lib/storage";
import { eq } from "drizzle-orm";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const id = Number(params.id);
  if (!id || isNaN(id)) {
    return new Response(JSON.stringify({ error: "Invalid ID" }), { status: 400 });
  }

  const [item] = await db.select().from(news).where(eq(news.id, id));

  if (!item) {
    return new Response(JSON.stringify({ error: "Berita tidak ditemukan" }), { status: 404 });
  }

  try {
    const { body, contentType } = await downloadFile(item.image);
    return new Response(body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Gagal memuat gambar" }), { status: 500 });
  }
};
