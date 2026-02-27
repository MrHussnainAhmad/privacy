"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Smartphone, Sparkles } from "lucide-react";

interface ProjectCard {
  _id: string;
  projectName: string;
  slug: string;
}

interface ProjectsGridProps {
  projects: ProjectCard[];
}

export default function ProjectsGrid({ projects }: ProjectsGridProps) {
  const [showAll, setShowAll] = useState(false);
  const initialCount = 4;

  const visibleProjects = useMemo(() => {
    if (showAll) {
      return projects;
    }
    return projects.slice(0, initialCount);
  }, [projects, showAll]);

  const hiddenCount = Math.max(projects.length - initialCount, 0);
  const hasMore = hiddenCount > 0;
  const placeholdersNeeded = showAll ? 0 : Math.max(initialCount - visibleProjects.length, 0);

  return (
    <div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visibleProjects.map((project) => (
          <Link
            key={project._id}
            href={`/privacy/${project.slug}`}
            className="group flex flex-col bg-slate-50 rounded-2xl overflow-hidden hover:bg-white border border-slate-200 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300"
          >
            <div className="h-48 bg-slate-200/50 flex items-center justify-center relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: "radial-gradient(#475569 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              ></div>
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400 group-hover:scale-110 group-hover:text-blue-600 transition-all duration-300">
                <Smartphone size={32} />
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {project.projectName}
                </h3>
                <ArrowUpRight size={20} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
              </div>
              <p className="text-slate-500 text-sm mb-6 line-clamp-2 flex-1">
                Review the privacy policy and details for this application.
              </p>
              <div className="pt-6 border-t border-slate-200/60 mt-auto flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-blue-600 transition-colors">
                Read Policy
              </div>
            </div>
          </Link>
        ))}
        {Array.from({ length: placeholdersNeeded }).map((_, index) => (
          <div
            key={`placeholder-${index}`}
            className="flex flex-col bg-slate-50 rounded-2xl overflow-hidden border border-dashed border-slate-200"
          >
            <div className="h-48 bg-slate-100 flex items-center justify-center relative overflow-hidden">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-300">
                <Smartphone size={32} />
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-slate-400">Coming Soon</h3>
              </div>
              <p className="text-slate-400 text-sm mb-6 line-clamp-2 flex-1">
                New privacy policy projects are on the way.
              </p>
              <div className="pt-6 border-t border-slate-200/60 mt-auto flex items-center text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Stay Tuned
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMore && !showAll && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="group inline-flex items-center gap-3 px-6 py-3 rounded-full border border-slate-200 bg-white text-slate-700 font-semibold shadow-sm hover:shadow-lg hover:border-blue-300 hover:text-blue-700 transition-all"
          >
            <span className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Sparkles size={16} />
              </span>
              Show All Projects
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-blue-600">
              +{hiddenCount}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
