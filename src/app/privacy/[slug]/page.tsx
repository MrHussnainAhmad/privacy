import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { getPrivacyPageData } from "@/lib/privacy/data";
import { getWatermarkStyle } from "@/lib/privacy/watermark";

const PrintPolicyButton = dynamic(() => import("@/components/privacy/PrintPolicyButton"), {
  loading: () => <div className="h-10 w-32 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />,
});

export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { project } = await getPrivacyPageData(slug);

  if (!project) {
    return { title: "Privacy Policy Not Found" };
  }

  return {
    title: `${project.projectName} - Privacy Policy`,
    description: `Privacy Policy for ${project.projectName}`,
  };
}

export default async function PrivacyPolicyPage({ params }: Props) {
  const { slug } = await params;
  const { project, logoUrl } = await getPrivacyPageData(slug);

  if (!project) {
    notFound();
  }

  const { projectName, privacyPolicyContent, updatedAt } = project;
  const isRemoteLogo = logoUrl.startsWith("http");
  const watermarkStyle = getWatermarkStyle(slug, logoUrl);

  return (
    <div className="privacy-page relative min-h-[60vh]">
      <div
        className="privacy-watermark pointer-events-none fixed inset-0 print:hidden"
        style={watermarkStyle}
        aria-hidden="true"
      />

      <div className="privacy-print-content relative z-10 mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-12 md:py-20">
        <div className="mb-6 flex justify-end print:hidden">
          <PrintPolicyButton />
        </div>

        <header className="privacy-print-header mb-8 sm:mb-10 border-b border-slate-200 pb-6 sm:pb-8 text-center dark:border-slate-800">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white p-2 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700 sm:h-20 sm:w-20">
            <Image
              src={logoUrl}
              alt={`${projectName} logo`}
              width={72}
              height={72}
              priority
              sizes="80px"
              unoptimized={isRemoteLogo}
              className="h-full w-full object-contain"
            />
          </div>
          <h1 className="break-words text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl md:text-4xl">
            {projectName}
          </h1>
          <p className="mt-3 text-base font-medium text-slate-600 dark:text-slate-400 sm:mt-4 sm:text-lg">
            Privacy Policy
          </p>
          <div className="mt-2 flex justify-center text-sm text-slate-400 dark:text-slate-500">
            <span>Last Updated: {new Date(updatedAt).toLocaleDateString()}</span>
          </div>
        </header>

        <article className="prose prose-sm sm:prose-base lg:prose-lg prose-slate dark:prose-invert mx-auto max-w-none prose-headings:font-bold prose-headings:text-slate-800 dark:prose-headings:text-slate-100 prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-500 dark:hover:prose-a:text-blue-300 prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-li:text-slate-600 dark:prose-li:text-slate-300">
          <ReactMarkdown>{privacyPolicyContent}</ReactMarkdown>
        </article>

        <footer className="privacy-print-footer mt-12 border-t border-slate-200 pt-6 text-center text-sm text-slate-400 dark:border-slate-800 dark:text-slate-500 sm:mt-16 sm:pt-8">
          <p>
            &copy; {new Date().getFullYear()} {projectName}. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
