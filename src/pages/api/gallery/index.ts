import type { APIRoute } from "astro";
import { db } from "../../../db";
import { galleryImages } from "../../../db/schema";
import { auth } from "../../../lib/auth";
import { uploadImage, validateImage } from "../../../lib/storage";
import { desc } from "drizzle-orm";

export const prerender = false;

export const GET: APIRoute = async () => {
  const images = await db
    .select()
    .from(galleryImages)
    .orderBy(desc(galleryImages.createdAt));

  return new Response(JSON.stringify(images), {
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;
  const title = (formData.get("title") as string || "").trim();

  if (!file) {
    return new Response(
      JSON.stringify({ error: "File wajib diisi." }),
      { status: 400 },
    );
  }

  if (!title) {
    return new Response(
      JSON.stringify({ error: "Judul wajib diisi." }),
      { status: 400 },
    );
  }

  const validation = validateImage(file);
  if (!validation.valid) {
    return new Response(
      JSON.stringify({ error: validation.error }),
      { status: 400 },
    );
  }

  const { url } = await uploadImage(file, "gallery");

  const [inserted] = await db
    .insert(galleryImages)
    .values({ title, imageUrl: url })
    .returning();

  return new Response(JSON.stringify(inserted), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};
