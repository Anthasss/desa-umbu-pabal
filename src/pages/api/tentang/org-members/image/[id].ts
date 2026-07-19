import type { APIRoute } from "astro";
import { db } from "../../../../../db";
import { tentangOrgMembers } from "../../../../../db/schema";
import { downloadFile } from "../../../../../lib/storage";
import { eq } from "drizzle-orm";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const id = Number(params.id);
  if (!id || isNaN(id)) {
    return new Response(JSON.stringify({ error: "Invalid ID" }), { status: 400 });
  }

  const [member] = await db
    .select()
    .from(tentangOrgMembers)
    .where(eq(tentangOrgMembers.id, id));

  if (!member || !member.image) {
    return new Response(JSON.stringify({ error: "Gambar tidak ditemukan" }), {
      status: 404,
    });
  }

  try {
    const { body, contentType } = await downloadFile(member.image);
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
