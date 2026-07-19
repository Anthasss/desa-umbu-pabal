import type { APIRoute } from "astro";
import { db } from "../../../db";
import { letterSubmissions, letterTemplates } from "../../../db/schema";
import { auth } from "../../../lib/auth";
import { eq, desc } from "drizzle-orm";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const letters = await db
    .select({
      id: letterSubmissions.id,
      status: letterSubmissions.status,
      rejectionReason: letterSubmissions.rejectionReason,
      createdAt: letterSubmissions.createdAt,
      templateTitle: letterTemplates.title,
    })
    .from(letterSubmissions)
    .innerJoin(letterTemplates, eq(letterSubmissions.templateId, letterTemplates.id))
    .where(eq(letterSubmissions.userId, session.user.id))
    .orderBy(desc(letterSubmissions.createdAt));

  return new Response(JSON.stringify(letters), {
    headers: { "Content-Type": "application/json" },
  });
};
