import { NextResponse } from "next/server";

const STATIC_PATHS = [
  { path: "/", changeFrequency: "weekly", priority: "1.0" },
  { path: "/request-data-deletion", changeFrequency: "monthly", priority: "0.8" },
];

function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    "https://appsbyhussnain.vercel.app"
  ).replace(/\/$/, "");
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEntry(params: {
  loc: string;
  lastmod: Date;
  changeFrequency: string;
  priority: string;
}) {
  return [
    "  <url>",
    `    <loc>${escapeXml(params.loc)}</loc>`,
    `    <lastmod>${params.lastmod.toISOString()}</lastmod>`,
    `    <changefreq>${params.changeFrequency}</changefreq>`,
    `    <priority>${params.priority}</priority>`,
    "  </url>",
  ].join("\n");
}

export async function GET() {
  const siteUrl = getSiteUrl();
  const now = new Date();
  const entries: string[] = STATIC_PATHS.map((item) =>
    urlEntry({
      loc: `${siteUrl}${item.path === "/" ? "/" : item.path}`,
      lastmod: now,
      changeFrequency: item.changeFrequency,
      priority: item.priority,
    })
  );

  if (process.env.MONGODB_URI) {
    try {
      const [{ default: dbConnect }, { default: Project }] = await Promise.all([
        import("@/lib/db"),
        import("@/models/Project"),
      ]);

      await dbConnect();

      const projects = await Project.find({})
        .select({ slug: 1, updatedAt: 1, _id: 0 })
        .lean();

      for (const project of projects) {
        if (typeof project.slug !== "string" || !project.slug.trim()) continue;

        entries.push(
          urlEntry({
            loc: `${siteUrl}/privacy/${encodeURIComponent(project.slug.trim())}`,
            lastmod: project.updatedAt ? new Date(project.updatedAt) : now,
            changeFrequency: "monthly",
            priority: "0.7",
          })
        );
      }
    } catch {
      // Keep the sitemap readable even if the database is temporarily unavailable.
    }
  }

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    "</urlset>",
    "",
  ].join("\n");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
