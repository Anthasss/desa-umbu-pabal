import type { APIRoute } from "astro";
import { auth } from "../../../../lib/auth";
import { uploadImage, validateImage, deleteFile } from "../../../../lib/storage";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;
  const oldUrl = formData.get("oldUrl") as string | null;

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

  // Delete old image from S3 storage if it exists
  if (oldUrl) {
    try {
      await deleteFile(oldUrl);
    } catch {
      // Ignore deletion errors
    }
  }

  const { url } = await uploadImage(file, "tentang/org-members");

  return new Response(JSON.stringify({ url }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};
