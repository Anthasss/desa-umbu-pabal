import type { APIRoute } from "astro";
import { db } from "../../../../db";
import { letterSubmissions } from "../../../../db/schema";
import { auth } from "../../../../lib/auth";
import { downloadFile } from "../../../../lib/storage";
import { eq } from "drizzle-orm";

export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
  const id = Number(params.id);
  if (isNaN(id)) {
    return new Response(JSON.stringify({ error: "Invalid ID" }), { status: 400 });
  }

  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const [letter] = await db
    .select()
    .from(letterSubmissions)
    .where(eq(letterSubmissions.id, id));

  if (!letter) {
    return new Response(JSON.stringify({ error: "Surat tidak ditemukan" }), {
      status: 404,
    });
  }

  try {
    const { body, contentType } = await downloadFile(letter.fileUrl);
    return new Response(body, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${letter.fileName}"`,
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Gagal mengunduh file" }), {
      status: 500,
    });
  }
};
