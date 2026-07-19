import type { APIRoute } from "astro";
import { db } from "../../../../db";
import { siteSettings } from "../../../../db/schema";
import { downloadFile } from "../../../../lib/storage";
import { eq } from "drizzle-orm";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const key = params.key;
  if (!key) {
    return new Response(JSON.stringify({ error: "Invalid key" }), { status: 400 });
  }

  const [setting] = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.key, key));

  if (!setting || !setting.value) {
    return new Response(JSON.stringify({ error: "Setting tidak ditemukan" }), {
      status: 404,
    });
  }

  try {
    const { body, contentType } = await downloadFile(setting.value);
    return new Response(body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-cache",
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Gagal memuat gambar" }), {
      status: 500,
    });
  }
};
