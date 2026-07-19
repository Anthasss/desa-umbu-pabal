import type { APIRoute } from "astro";
import { db } from "../../../db";
import { feedback } from "../../../db/schema";
import { auth } from "../../../lib/auth";
import { desc } from "drizzle-orm";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const allFeedback = await db
    .select()
    .from(feedback)
    .orderBy(desc(feedback.createdAt));

  return new Response(JSON.stringify(allFeedback), {
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const body = await request.json();
  const { message } = body;

  if (!message || typeof message !== "string" || message.trim().length < 10) {
    return new Response(
      JSON.stringify({ error: "Pesan harus minimal 10 karakter." }),
      { status: 400 },
    );
  }

  if (message.length > 2000) {
    return new Response(
      JSON.stringify({ error: "Pesan maksimal 2000 karakter." }),
      { status: 400 },
    );
  }

  const [row] = await db
    .insert(feedback)
    .values({ message: message.trim() })
    .returning();

  return new Response(JSON.stringify({ success: true, id: row.id }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};
