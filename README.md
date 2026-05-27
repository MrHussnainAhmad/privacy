# Google Play Privacy

Private Next.js project for publishing app privacy policies through an admin dashboard.

## Private Project Notice

This repository is private and intended for internal/owner use only.

## Features

- Public privacy policy pages by slug: `/privacy/[slug]`
- Admin dashboard for creating, editing, and deleting policies
- Credentials-based admin authentication with NextAuth
- MongoDB Atlas integration with Mongoose

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS
- NextAuth
- MongoDB + Mongoose

## Environment Variables

Create `.env.local` with:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
ADMIN_PASSWORD=your_admin_password
# optional
ADMIN_EMAIL=admin@local
```

## Install and Run

```bash
npm install
npm run seed:admin
npm run dev
```

App runs at `http://localhost:3000`.

## Production

```bash
npm run build
npm start
```

## Admin Usage

1. Open `/auth/login`
2. Sign in with `ADMIN_PASSWORD`
3. Go to `/admin`
4. Create/edit project with:
   - Project Name
   - Slug
   - Privacy Policy Content (Markdown)

Policies become publicly visible at `/privacy/<slug>`.

## Scripts

- `npm run dev` - start development server
- `npm run build` - create production build
- `npm start` - start production server
- `npm run lint` - run ESLint
- `npm run seed:admin` - create/update admin user in MongoDB
