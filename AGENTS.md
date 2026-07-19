## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Tech Stack

- **Framework**: Astro 7 with React integration, SSR (`prerender = false` on dynamic pages)
- **Database**: PostgreSQL (Neon serverless) via Drizzle ORM
- **Auth**: better-auth with admin plugin (role-based, email+password)
- **Storage**: Vercel Blob (private store)
- **Deployment**: Vercel

## Vercel Blob Storage Conventions

The Vercel Blob store is **private**. Never use `access: "public"` in `put()` calls.

### Utility Functions (`src/lib/storage.ts`)

| Function | Purpose | Allowed Types | Max Size |
|----------|---------|---------------|----------|
| `uploadImage(file, folder)` | Upload image to blob | jpeg, png, webp, gif | 5MB |
| `validateImage(file)` | Validate image before upload | jpeg, png, webp, gif | 5MB |
| `uploadFile(file, folder)` | Upload document to blob | pdf, docx | 10MB |
| `validateFile(file)` | Validate document before upload | pdf, docx | 10MB |
| `deleteFile(url)` | Delete a blob by URL | — | — |
| `downloadFile(url)` | Fetch blob with auth token, returns `{ body, contentType }` | — | — |

### Serving Private Blob Images

Private blob URLs cannot be used directly in `<img src>` tags. Always serve through a proxy endpoint:

1. **Proxy endpoint pattern**: `src/pages/api/settings/image/[key].ts`
   - Reads blob URL from DB by setting key
   - Fetches from blob with auth token via `downloadFile()`
   - Streams response with correct `Content-Type`
   - Uses `Cache-Control: no-cache`

2. **Cache-busting**: When referencing the proxy URL in templates, append a cache-busting query param using the blob URL itself (it changes per upload):
   ```astro
   <img src={`/api/settings/image/settingKey?v=${encodeURIComponent(blobUrl)}`} />
   ```

### Image Upload Flow

1. Client uploads via `POST /api/settings/upload-image` (multipart FormData)
2. Endpoint calls `uploadImage(file, folder)` → returns blob URL
3. Endpoint deletes old blob (if exists) via `deleteFile()`
4. Endpoint saves new blob URL to DB immediately (auto-save, no separate save step needed)
5. Returns `{ url }` to client

### Adding New Image-Backed Sections

When adding a new section that stores images:

1. Add a setting key to `site_settings` table (or a dedicated table with a `imageUrl` column)
2. Create an upload endpoint that follows the pattern in `src/pages/api/settings/upload-image.ts`
3. Create a proxy endpoint following `src/pages/api/settings/image/[key].ts`
4. In `.astro` templates, use the proxy URL with cache-busting, never the raw blob URL
5. Delete old blobs when new images are uploaded to avoid orphaned storage

### Existing Proxy Endpoints

| Endpoint | Serves |
|----------|--------|
| `/api/settings/image/[key]` | Settings images (reads blob URL from `site_settings` table) |
| `/api/templates/download/[id]` | Template file downloads |
| `/api/letters/download/[id]` | Letter file downloads (admin only) |

## Database

Drizzle ORM with PostgreSQL. Schema at `src/db/schema.ts`. Push changes with:

```
npx drizzle-kit push
```

Key tables: `user`, `session`, `account`, `verification`, `news`, `letter_templates`, `letter_submissions`, `feedback`, `site_settings`, `vm_missions`.

## Auth

better-auth with admin plugin. The user with email `admin@umbupabal.com` is auto-assigned `role: "admin"` via a database hook.

- Server config: `src/lib/auth.ts`
- Client config: `src/lib/auth-client.ts`
- Auth API route: `src/pages/api/auth/[...all].ts`

Admin pages check `session.user.role === "admin"` in the frontmatter and redirect if not admin.
