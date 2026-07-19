import type { APIRoute } from "astro";
import { db } from "../../../db";
import { letterSubmissions, letterTemplates, user } from "../../../db/schema";
import { auth } from "../../../lib/auth";
import { eq } from "drizzle-orm";

export const prerender = false;

const VALID_STATUSES = ["dikirim", "direview", "diterima", "ditolak"];

export const GET: APIRoute = async ({ params, request }) => {
  const id = Number(params.id);
  if (isNaN(id)) {
    return new Response(JSON.stringify({ error: "Invalid ID" }), { status: 400 });
  }

  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const [letter] = await db
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
    .where(eq(letterSubmissions.id, id));

  if (!letter) {
    return new Response(JSON.stringify({ error: "Surat tidak ditemukan" }), {
      status: 404,
    });
  }

  if (
    letter.userId !== session.user.id &&
    session.user.role !== "admin"
  ) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
    });
  }

  return new Response(JSON.stringify(letter), {
    headers: { "Content-Type": "application/json" },
  });
};

export const PATCH: APIRoute = async ({ params, request }) => {
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

  const body = await request.json();
  const { status, rejectionReason } = body;

  if (!status || !VALID_STATUSES.includes(status)) {
    return new Response(
      JSON.stringify({ error: "Status tidak valid." }),
      { status: 400 },
    );
  }

  if (status === "ditolak" && !rejectionReason) {
    return new Response(
      JSON.stringify({ error: "Alasan penolakan wajib diisi." }),
      { status: 400 },
    );
  }

  const [existing] = await db
    .select()
    .from(letterSubmissions)
    .where(eq(letterSubmissions.id, id));

  if (!existing) {
    return new Response(JSON.stringify({ error: "Surat tidak ditemukan" }), {
      status: 404,
    });
  }

  const [updated] = await db
    .update(letterSubmissions)
    .set({
      status,
      rejectionReason: status === "ditolak" ? rejectionReason : null,
    })
    .where(eq(letterSubmissions.id, id))
    .returning();

  return new Response(JSON.stringify(updated), {
    headers: { "Content-Type": "application/json" },
  });
};
