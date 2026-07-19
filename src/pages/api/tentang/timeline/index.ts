import type { APIRoute } from "astro";
import { db } from "../../../../db";
import { tentangTimelineEvents } from "../../../../db/schema";
import { auth } from "../../../../lib/auth";
import { asc } from "drizzle-orm";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const events = await db.select().from(tentangTimelineEvents).orderBy(asc(tentangTimelineEvents.sortOrder));

  return new Response(JSON.stringify(events), {
    headers: { "Content-Type": "application/json" },
  });
};

export const PUT: APIRoute = async ({ request }) => {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const body = await request.json();
  const { events } = body;

  if (!Array.isArray(events)) {
    return new Response(
      JSON.stringify({ error: "Invalid payload" }),
      { status: 400 },
    );
  }

  // Delete all existing events and re-insert
  await db.delete(tentangTimelineEvents);

  if (events.length > 0) {
    await db.insert(tentangTimelineEvents).values(
      events.map((e: any, i: number) => ({
        year: e.year,
        title: e.title,
        description: e.description,
        sortOrder: e.sortOrder ?? i,
      })),
    );
  }

  const updated = await db.select().from(tentangTimelineEvents).orderBy(asc(tentangTimelineEvents.sortOrder));

  return new Response(JSON.stringify(updated), {
    headers: { "Content-Type": "application/json" },
  });
};
