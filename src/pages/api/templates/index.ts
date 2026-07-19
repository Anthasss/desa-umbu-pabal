import type { APIRoute } from "astro";
import { db } from "../../../db";
import { letterTemplates } from "../../../db/schema";
import { auth } from "../../../lib/auth";
import { uploadFile, validateFile } from "../../../lib/storage";
import { eq, desc } from "drizzle-orm";

export const prerender = false;

export const GET: APIRoute = async () => {
  const templates = await db
    .select()
    .from(letterTemplates)
    .orderBy(desc(letterTemplates.createdAt));

  return new Response(JSON.stringify(templates), {
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const formData = await request.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const file = formData.get("file") as File;

  if (!title || !file) {
    return new Response(
      JSON.stringify({ error: "Judul dan file wajib diisi." }),
      { status: 400 },
    );
  }

  const validation = validateFile(file);
  if (!validation.valid) {
    return new Response(JSON.stringify({ error: validation.error }), {
      status: 400,
    });
  }

  const { url, fileName, fileType } = await uploadFile(file, "templates");

  const [template] = await db
    .insert(letterTemplates)
    .values({
      title,
      description: description || null,
      fileUrl: url,
      fileName,
      fileType,
    })
    .returning();

  return new Response(JSON.stringify(template), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};
