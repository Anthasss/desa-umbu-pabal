import "dotenv/config";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const endpoint = process.env.S3_ENDPOINT;
const accessKeyId = process.env.S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
const bucket = process.env.S3_BUCKET;

if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) {
  console.error("Missing S3 env vars.");
  process.exit(1);
}

const s3 = new S3Client({
  endpoint,
  region: "auto",
  credentials: { accessKeyId, secretAccessKey },
  forcePathStyle: true,
});

const key = `test/${Date.now()}-ping.txt`;

async function main() {
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: new TextEncoder().encode("pong"),
      ContentType: "text/plain",
    }),
  );
  console.log(`PUT ok → ${endpoint}/${bucket}/${key}`);

  const res = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  const text = await res.Body!.transformToString();
  console.log(`GET ok → ${text}`);

  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
  console.log("DELETE ok");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("FAILED:", e.message);
    process.exit(1);
  });