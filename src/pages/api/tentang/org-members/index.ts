import type { APIRoute } from "astro";
import { db } from "../../../../db";
import { tentangOrgMembers } from "../../../../db/schema";
import { auth } from "../../../../lib/auth";
import { asc } from "drizzle-orm";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const members = await db.select().from(tentangOrgMembers).orderBy(asc(tentangOrgMembers.sortOrder));

  return new Response(JSON.stringify(members), {
    headers: { "Content-Type": "application/json" },
  });
};

export const PUT: APIRoute = async ({ request }) => {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const body = await request.json();
  const { members } = body;

  if (!Array.isArray(members)) {
    return new Response(
      JSON.stringify({ error: "Invalid payload" }),
      { status: 400 },
    );
  }

  // Delete all existing members and re-insert
  await db.delete(tentangOrgMembers);

  if (members.length > 0) {
      await db.insert(tentangOrgMembers).values(
      members.map((m: any, i: number) => ({
        name: m.name,
        role: m.role,
        image: m.image || null,
        isHead: m.isHead ?? false,
        sortOrder: m.sortOrder ?? i,
      })),
    );
  }

  const updated = await db.select().from(tentangOrgMembers).orderBy(asc(tentangOrgMembers.sortOrder));

  return new Response(JSON.stringify(updated), {
    headers: { "Content-Type": "application/json" },
  });
};
