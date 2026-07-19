import type { APIRoute } from "astro";
import { db } from "../../../../db";
import { letterTemplates } from "../../../../db/schema";
import { downloadFile } from "../../../../lib/storage";
import { eq } from "drizzle-orm";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const id = Number(params.id);
  if (isNaN(id)) {
    return new Response(JSON.stringify({ error: "Invalid ID" }), { status: 400 });
  }

  const [template] = await db
    .select()
    .from(letterTemplates)
    .where(eq(letterTemplates.id, id));

  if (!template) {
    return new Response(JSON.stringify({ error: "Template tidak ditemukan" }), {
      status: 404,
    });
  }

  try {
    const { body, contentType } = await downloadFile(template.fileUrl);
    return new Response(body, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${template.fileName}"`,
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Gagal mengunduh file" }), {
      status: 500,
    });
  }
};
