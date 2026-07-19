import type { APIRoute } from "astro";
import { db } from "../../../db";
import { letterTemplates } from "../../../db/schema";
import { auth } from "../../../lib/auth";
import { deleteFile } from "../../../lib/storage";
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
    return new Response(JSON.stringify({ error: "Template not found" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(template), {
    headers: { "Content-Type": "application/json" },
  });
};

export const DELETE: APIRoute = async ({ params, request }) => {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const id = Number(params.id);
  if (isNaN(id)) {
    return new Response(JSON.stringify({ error: "Invalid ID" }), { status: 400 });
  }

  const [template] = await db
    .select()
    .from(letterTemplates)
    .where(eq(letterTemplates.id, id));

  if (!template) {
    return new Response(JSON.stringify({ error: "Template not found" }), {
      status: 404,
    });
  }

  await deleteFile(template.fileUrl);
  await db.delete(letterTemplates).where(eq(letterTemplates.id, id));

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
