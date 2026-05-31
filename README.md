# Google Play Privacy

Private Next.js project for privacy policy publishing and secure user data deletion request handling.

## Features

- Public privacy policy pages: `/privacy/[slug]`
- Admin project CRUD for privacy entries
- Public deletion request flow: `/request-data-deletion`
- Verification flow: `/request-data-deletion/verify`
- Admin deletion dashboard: `/deleteaccountrequests`
- App registry CRUD for deletion integrations
- Deletion request lifecycle + logs + admin audit logs

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- NextAuth (credentials)
- MongoDB Atlas + Mongoose
- Tailwind CSS

## Routes

- Public:
  - `/`
  - `/privacy/[slug]`
  - `/request-data-deletion`
  - `/request-data-deletion/verify?rid=<requestId>&token=<token>`
- Admin:
  - `/admin`
  - `/deleteaccountrequests`

## Environment Variables

Copy `.env.example` to `.env.local` and fill values.

Required:

- `MONGODB_URI`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Deletion API auth (choose by app `authType`):

- `DELETION_BEARER_JWT`
- `DELETION_API_KEY`
- `DELETION_SERVICE_TOKEN`

Cloudinary is used by admin logo upload in `/deleteaccountrequests` (no manual logo URL input needed).

## Install and Run

```bash
npm install
npm run seed:admin
npm run dev
```

## Data Deletion Workflow

1. User opens `/request-data-deletion`
2. Selects app and enters account email only
3. Backend creates `deletion_requests` record with status:
   - `pending_verification` or `verified` (for direct mode)
4. Verification (short-lived token) moves status to `verified`
5. Orchestrator calls target app deletion API with retries/backoff:
   - `processing -> completed | failed`

Response contract:

```json
{ "success": true, "status": "pending_verification", "message": "If this account exists, we sent verification instructions." }
```

## Security Notes

- No user password collection in deletion flow
- HTTPS-only validation for configured backend URLs
- Endpoint rate limiting on request initiation
- Honeypot anti-bot field on public form
- Verification token expires in ~20 minutes
- Only token hash stored in DB
- Email masked in logs (`emailMasked`)
- Admin audit logs for app config mutations
- Admin mutation origin check (`Origin` vs `NEXTAUTH_URL`)

## Google Play Compliance Usage

Use this system to provide a Play Store-compliant account deletion path by:

- Publishing `/request-data-deletion` as your public deletion URL
- Keeping app registry entries accurate for each listed app
- Ensuring target app delete endpoint truly deletes or anonymizes required user data
- Documenting retention policy (fraud/legal/security) in your privacy pages

## Scripts

- `npm run dev`
- `npm run build`
- `npm start`
- `npm run lint`
- `npm run seed:admin`
