import dbConnect from "@/lib/db";
import Project, { IProject } from "@/models/Project";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import PublicShell from "@/components/site/PublicShell";

export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await dbConnect();
  const project = (await Project.findOne({ slug }).select({ projectName: 1 }).lean()) as unknown as IProject | null;

  if (!project) {
    return { title: "Privacy Policy Not Found" };
  }

  const name = project.projectName;
  return {
    title: `${name} - Privacy Policy`,
    description: `Privacy Policy for ${name}`,
  };
}

export default async function PrivacyPolicyPage({ params }: Props) {
  const { slug } = await params;
  await dbConnect();
  const project = (await Project.findOne({ slug }).lean()) as unknown as IProject | null;

  if (!project) {
    notFound();
  }

  const { projectName, privacyPolicyContent, updatedAt } = project;

  return (
    <PublicShell>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-12 md:py-20">
        <header className="mb-8 sm:mb-10 text-center border-b border-slate-200 dark:border-slate-800 pb-6 sm:pb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl break-words">
            {projectName}
          </h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium">Privacy Policy</p>
          <div className="mt-2 flex justify-center text-sm text-slate-400 dark:text-slate-500">
            <span>Last Updated: {new Date(updatedAt).toLocaleDateString()}</span>
          </div>
        </header>

        <article className="prose prose-sm sm:prose-base lg:prose-lg prose-slate dark:prose-invert mx-auto max-w-none prose-headings:font-bold prose-headings:text-slate-800 dark:prose-headings:text-slate-100 prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-500 dark:hover:prose-a:text-blue-300 prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-li:text-slate-600 dark:prose-li:text-slate-300">
          <ReactMarkdown>{privacyPolicyContent}</ReactMarkdown>
        </article>

        <footer className="mt-12 sm:mt-16 border-t border-slate-200 dark:border-slate-800 pt-6 sm:pt-8 text-center text-sm text-slate-400 dark:text-slate-500">
          <p>&copy; {new Date().getFullYear()} {projectName}. All rights reserved.</p>
        </footer>
      </div>
    </PublicShell>
  );
}
