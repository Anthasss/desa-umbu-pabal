import { put, del } from "@vercel/blob";

function getBlobToken(): string {
  const token = import.meta.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not set. Add it to your .env file or environment variables.",
    );
  }
  return token;
}

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const IMAGE_ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const IMAGE_MAX_FILE_SIZE = 5 * 1024 * 1024;

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: "Hanya file PDF dan DOCX yang diizinkan." };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "Ukuran file maksimal 10MB." };
  }
  return { valid: true };
}

export function validateImage(file: File): { valid: boolean; error?: string } {
  if (!IMAGE_ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: "Hanya file gambar (JPEG, PNG, WebP, GIF) yang diizinkan." };
  }
  if (file.size > IMAGE_MAX_FILE_SIZE) {
    return { valid: false, error: "Ukuran gambar maksimal 5MB." };
  }
  return { valid: true };
}

export function getFileType(file: File): string {
  if (file.type === "application/pdf") return "pdf";
  if (
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
    return "docx";
  return "unknown";
}

export async function uploadFile(
  file: File,
  folder: string,
): Promise<{ url: string; fileName: string; fileType: string }> {
  const ext = file.name.split(".").pop() || "bin";
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const pathname = `${folder}/${Date.now()}-${safeName}`;

  const blob = await put(pathname, file, {
    access: "private",
    addRandomSuffix: true,
    token: getBlobToken(),
  });

  return {
    url: blob.url,
    fileName: safeName,
    fileType: getFileType(file),
  };
}

export async function deleteFile(url: string): Promise<void> {
  await del(url, { token: getBlobToken() });
}

export async function downloadFile(
  url: string,
): Promise<{ body: ReadableStream; contentType: string }> {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${getBlobToken()}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to download file: ${res.statusText}`);
  }

  return {
    body: res.body!,
    contentType: res.headers.get("content-type") || "application/octet-stream",
  };
}

export async function uploadImage(
  file: File,
  folder: string,
): Promise<{ url: string }> {
  const ext = file.name.split(".").pop() || "jpg";
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const pathname = `${folder}/${Date.now()}-${safeName}`;

  const blob = await put(pathname, file, {
    access: "private",
    addRandomSuffix: true,
    token: getBlobToken(),
  });

  return { url: blob.url };
}
