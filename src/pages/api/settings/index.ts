import type { APIRoute } from "astro";
import { db } from "../../../db";
import { siteSettings, vmMissions } from "../../../db/schema";
import { auth } from "../../../lib/auth";
import { deleteFile } from "../../../lib/storage";
import { asc, eq } from "drizzle-orm";

export const prerender = false;

export const GET: APIRoute = async () => {
  const settings = await db.select().from(siteSettings);
  const missions = await db.select().from(vmMissions).orderBy(asc(vmMissions.sortOrder));

  const settingsObj: Record<string, string> = {};
  for (const s of settings) {
    settingsObj[s.key] = s.value ?? "";
  }

  return new Response(
    JSON.stringify({ settings: settingsObj, missions }),
    { headers: { "Content-Type": "application/json" } },
  );
};

export const PATCH: APIRoute = async ({ request }) => {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const body = await request.json();
  const updates = body.settings as Record<string, string>;

  if (!updates || typeof updates !== "object") {
    return new Response(
      JSON.stringify({ error: "Invalid payload" }),
      { status: 400 },
    );
  }

  // Clean up old S3 images if image settings are changing
  const imageKeys = ["vhw_kepalaDesaImage", "hero_image", "tentang_hero_image"];
  for (const imgKey of imageKeys) {
    if (updates[imgKey] !== undefined) {
      const [existing] = await db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.key, imgKey));

      const oldUrl = existing?.value ?? "";
      const newUrl = updates[imgKey];

      if (oldUrl && oldUrl !== newUrl) {
        try {
          await deleteFile(oldUrl);
        } catch {
          // Ignore deletion errors
        }
      }
    }
  }

  for (const [key, value] of Object.entries(updates)) {
    const existing = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, key))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(siteSettings).values({ key, value });
    } else {
      await db
        .update(siteSettings)
        .set({ value })
        .where(eq(siteSettings.key, key));
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
