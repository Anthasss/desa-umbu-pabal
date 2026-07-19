import type { APIRoute } from "astro";
import { db } from "../../../../db";
import { letterSubmissions, letterTemplates } from "../../../../db/schema";
import { eq } from "drizzle-orm";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const id = url.searchParams.get("id");

  if (!id || isNaN(Number(id))) {
    return new Response(
      JSON.stringify({ error: "ID tidak valid." }),
      { status: 400 },
    );
  }

  const [letter] = await db
    .select({
      id: letterSubmissions.id,
      status: letterSubmissions.status,
      rejectionReason: letterSubmissions.rejectionReason,
      createdAt: letterSubmissions.createdAt,
      templateTitle: letterTemplates.title,
    })
    .from(letterSubmissions)
    .innerJoin(letterTemplates, eq(letterSubmissions.templateId, letterTemplates.id))
    .where(eq(letterSubmissions.id, Number(id)));

  if (!letter) {
    return new Response(
      JSON.stringify({ error: "Surat tidak ditemukan." }),
      { status: 404 },
    );
  }

  return new Response(JSON.stringify(letter), {
    headers: { "Content-Type": "application/json" },
  });
};
