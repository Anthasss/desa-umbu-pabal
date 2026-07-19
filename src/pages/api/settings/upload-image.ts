import type { APIRoute } from "astro";
import { db } from "../../../db";
import { siteSettings } from "../../../db/schema";
import { auth } from "../../../lib/auth";
import { uploadImage, validateImage, deleteFile } from "../../../lib/storage";
import { eq } from "drizzle-orm";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return new Response(
      JSON.stringify({ error: "File wajib diisi." }),
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

  // Delete old image from blob storage if it exists
  const [existing] = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.key, "vhw_kepalaDesaImage"));

  if (existing?.value?.includes("blob.vercel-storage.com")) {
    try {
      await deleteFile(existing.value);
    } catch {
      // Ignore deletion errors — old blob may already be gone
    }
  }

  const { url } = await uploadImage(file, "settings");

  // Immediately save the new URL to the DB
  if (existing) {
    await db
      .update(siteSettings)
      .set({ value: url })
      .where(eq(siteSettings.key, "vhw_kepalaDesaImage"));
  } else {
    await db.insert(siteSettings).values({
      key: "vhw_kepalaDesaImage",
      value: url,
    });
  }

  return new Response(JSON.stringify({ url }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};
