import { cache } from "react";
import dbConnect from "@/lib/db";
import Project, { IProject } from "@/models/Project";
import DeletionApp from "@/models/DeletionApp";

export const getPrivacyPageData = cache(async (slug: string) => {
  await dbConnect();

  const [project, app] = await Promise.all([
    Project.findOne({ slug }).lean() as Promise<IProject | null>,
    DeletionApp.findOne({
      isActive: true,
      $or: [{ privacySlug: slug }, { appId: slug }],
    })
      .select({ logoUrl: 1 })
      .lean(),
  ]);

  return {
    project,
    logoUrl: app?.logoUrl || "/logo.png",
  };
});
