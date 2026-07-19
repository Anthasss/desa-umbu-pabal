import type { APIRoute } from "astro";
import { db } from "../../../db";
import { galleryImages } from "../../../db/schema";
import { auth } from "../../../lib/auth";
import { deleteFile } from "../../../lib/storage";
import { eq } from "drizzle-orm";

export const prerender = false;

export const DELETE: APIRoute = async ({ request, params }) => {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const id = Number(params.id);
  if (!id || isNaN(id)) {
    return new Response(JSON.stringify({ error: "Invalid ID" }), { status: 400 });
  }

  const [image] = await db
    .select()
    .from(galleryImages)
    .where(eq(galleryImages.id, id));

  if (!image) {
    return new Response(JSON.stringify({ error: "Gambar tidak ditemukan" }), {
      status: 404,
    });
  }

  // Delete from blob storage
  if (image.imageUrl.includes("blob.vercel-storage.com")) {
    try {
      await deleteFile(image.imageUrl);
    } catch {
      // Ignore deletion errors
    }
  }

  await db.delete(galleryImages).where(eq(galleryImages.id, id));

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
