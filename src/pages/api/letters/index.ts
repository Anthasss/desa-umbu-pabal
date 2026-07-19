import type { APIRoute } from "astro";
import { db } from "../../../db";
import { letterSubmissions, letterTemplates, user } from "../../../db/schema";
import { auth } from "../../../lib/auth";
import { uploadFile, validateFile } from "../../../lib/storage";
import { eq, desc } from "drizzle-orm";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const url = new URL(request.url);
  const statusFilter = url.searchParams.get("status");

  let query = db
    .select({
      id: letterSubmissions.id,
      userId: letterSubmissions.userId,
      templateId: letterSubmissions.templateId,
      fileUrl: letterSubmissions.fileUrl,
      fileName: letterSubmissions.fileName,
      fileType: letterSubmissions.fileType,
      status: letterSubmissions.status,
      rejectionReason: letterSubmissions.rejectionReason,
      createdAt: letterSubmissions.createdAt,
      updatedAt: letterSubmissions.updatedAt,
      userName: user.name,
      userEmail: user.email,
      templateTitle: letterTemplates.title,
    })
    .from(letterSubmissions)
    .innerJoin(user, eq(letterSubmissions.userId, user.id))
    .innerJoin(letterTemplates, eq(letterSubmissions.templateId, letterTemplates.id))
    .orderBy(desc(letterSubmissions.createdAt));

  if (statusFilter && statusFilter !== "all") {
    query = query.where(eq(letterSubmissions.status, statusFilter)) as typeof query;
  }

  const letters = await query;

  return new Response(JSON.stringify(letters), {
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

  const formData = await request.formData();
  const templateId = Number(formData.get("templateId"));
  const file = formData.get("file") as File;

  if (!templateId || !file) {
    return new Response(
      JSON.stringify({ error: "Template dan file wajib diisi." }),
      { status: 400 },
    );
  }

  const validation = validateFile(file);
  if (!validation.valid) {
    return new Response(JSON.stringify({ error: validation.error }), {
      status: 400,
    });
  }

  const [template] = await db
    .select()
    .from(letterTemplates)
    .where(eq(letterTemplates.id, templateId));

  if (!template) {
    return new Response(JSON.stringify({ error: "Template tidak ditemukan." }), {
      status: 404,
    });
  }

  const { url, fileName, fileType } = await uploadFile(file, "letters");

  const [submission] = await db
    .insert(letterSubmissions)
    .values({
      userId: session.user.id,
      templateId,
      fileUrl: url,
      fileName,
      fileType,
    })
    .returning();

  return new Response(JSON.stringify(submission), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};
