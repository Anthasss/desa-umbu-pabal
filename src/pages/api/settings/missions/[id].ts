import type { APIRoute } from "astro";
import { db } from "../../../../db";
import { vmMissions } from "../../../../db/schema";
import { auth } from "../../../../lib/auth";
import { eq } from "drizzle-orm";

export const prerender = false;

export const DELETE: APIRoute = async ({ params, request }) => {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const id = Number(params.id);
  if (isNaN(id)) {
    return new Response(
      JSON.stringify({ error: "Invalid ID" }),
      { status: 400 },
    );
  }

  await db.delete(vmMissions).where(eq(vmMissions.id, id));

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
