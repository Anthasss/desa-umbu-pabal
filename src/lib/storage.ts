import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

function getS3Client(): S3Client {
  const endpoint = import.meta.env.S3_ENDPOINT;
  const accessKeyId = import.meta.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = import.meta.env.S3_SECRET_ACCESS_KEY;
  const bucket = import.meta.env.S3_BUCKET;

  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) {
    throw new Error(
      "S3 environment variables are not set. Add S3_ENDPOINT, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, and S3_BUCKET to your .env file.",
    );
  }

  return new S3Client({
    endpoint,
    region: "auto",
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true,
  });
}

function getS3Bucket(): string {
  const bucket = import.meta.env.S3_BUCKET;
  if (!bucket) throw new Error("S3_BUCKET is not set.");
  return bucket;
}

function getS3Endpoint(): string {
  const endpoint = import.meta.env.S3_ENDPOINT;
  if (!endpoint) throw new Error("S3_ENDPOINT is not set.");
  return endpoint;
}

/** Extract the object key from a full S3 URL. */
function getKeyFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    // Path style: https://endpoint/bucket/key
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts.length >= 2) return parts.slice(1).join("/");
    return null;
  } catch {
    return null;
  }
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
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `${folder}/${Date.now()}-${safeName}`;

  const arrayBuffer = await file.arrayBuffer();

  const s3 = getS3Client();
  await s3.send(
    new PutObjectCommand({
      Bucket: getS3Bucket(),
      Key: key,
      Body: new Uint8Array(arrayBuffer),
      ContentType: file.type || "application/octet-stream",
    }),
  );

  const url = `${getS3Endpoint()}/${getS3Bucket()}/${key}`;

  return {
    url,
    fileName: safeName,
    fileType: getFileType(file),
  };
}

export async function deleteFile(url: string): Promise<void> {
  const key = getKeyFromUrl(url);
  if (!key) return; // Not a valid S3 URL, skip

  const s3 = getS3Client();
  await s3.send(
    new DeleteObjectCommand({
      Bucket: getS3Bucket(),
      Key: key,
    }),
  );
}

export async function downloadFile(
  url: string,
): Promise<{ body: ReadableStream; contentType: string }> {
  const key = getKeyFromUrl(url);
  if (!key) throw new Error(`Invalid S3 URL: ${url}`);

  const s3 = getS3Client();
  const res = await s3.send(
    new GetObjectCommand({
      Bucket: getS3Bucket(),
      Key: key,
    }),
  );

  const body = res.Body!.transformToWebStream();

  return {
    body,
    contentType: res.ContentType || "application/octet-stream",
  };
}

export async function uploadImage(
  file: File,
  folder: string,
): Promise<{ url: string }> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `${folder}/${Date.now()}-${safeName}`;

  const arrayBuffer = await file.arrayBuffer();

  const s3 = getS3Client();
  await s3.send(
    new PutObjectCommand({
      Bucket: getS3Bucket(),
      Key: key,
      Body: new Uint8Array(arrayBuffer),
      ContentType: file.type || "image/jpeg",
    }),
  );

  const url = `${getS3Endpoint()}/${getS3Bucket()}/${key}`;

  return { url };
}