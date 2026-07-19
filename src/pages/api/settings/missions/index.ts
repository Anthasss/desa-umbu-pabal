import type { APIRoute } from "astro";
import { db } from "../../../../db";
import { vmMissions } from "../../../../db/schema";
import { auth } from "../../../../lib/auth";
import { asc } from "drizzle-orm";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const body = await request.json();
  const { title, description, sortOrder } = body;

  if (!title || !description) {
    return new Response(
      JSON.stringify({ error: "Judul dan deskripsi wajib diisi." }),
      { status: 400 },
    );
  }

  const [mission] = await db
    .insert(vmMissions)
    .values({ title, description, sortOrder: sortOrder ?? 0 })
    .returning();

  return new Response(JSON.stringify(mission), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};

export const PUT: APIRoute = async ({ request }) => {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const body = await request.json();
  const { missions } = body;

  if (!Array.isArray(missions)) {
    return new Response(
      JSON.stringify({ error: "Invalid payload" }),
      { status: 400 },
    );
  }

  // Delete all existing missions and re-insert
  await db.delete(vmMissions);

  if (missions.length > 0) {
    await db.insert(vmMissions).values(
      missions.map((m: any, i: number) => ({
        title: m.title,
        description: m.description,
        sortOrder: m.sortOrder ?? i,
      })),
    );
  }

  const updated = await db.select().from(vmMissions).orderBy(asc(vmMissions.sortOrder));

  return new Response(JSON.stringify(updated), {
    headers: { "Content-Type": "application/json" },
  });
};
