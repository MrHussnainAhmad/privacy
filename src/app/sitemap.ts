import type { MetadataRoute } from "next";

function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    "https://appsbyhussnain.vercel.app"
  ).replace(/\/$/, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/request-data-deletion`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  if (!process.env.MONGODB_URI) {
    return entries;
  }

  try {
    const [{ default: dbConnect }, { default: Project }] = await Promise.all([
      import("@/lib/db"),
      import("@/models/Project"),
    ]);

    await dbConnect();

    const projects = await Project.find({})
      .select({ slug: 1, updatedAt: 1, _id: 0 })
      .lean();

    entries.push(
      ...projects
        .filter((project) => typeof project.slug === "string" && project.slug.trim())
        .map((project) => ({
          url: `${siteUrl}/privacy/${encodeURIComponent(project.slug.trim())}`,
          lastModified: project.updatedAt ? new Date(project.updatedAt) : now,
          changeFrequency: "monthly" as const,
          priority: 0.7,
        }))
    );
  } catch {
    return entries;
  }

  return entries;
}
