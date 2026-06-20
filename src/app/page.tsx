import Link from "next/link";
import { cache } from "react";
import { Mail, Linkedin, Gamepad2, Smartphone, Globe, CheckCircle2 } from "lucide-react";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import ProjectsGrid from "@/components/ProjectsGrid";
import PublicShell from "@/components/site/PublicShell";

export const revalidate = 60;

interface IProjectDoc {
  _id: string;
  projectName: string;
  slug: string;
  privacyPolicyContent?: string;
}

const getProjects = cache(async () => {
  await dbConnect();
  const rawProjects = await Project.find({})
    .select({ projectName: 1, slug: 1, privacyPolicyContent: 1 })
    .sort({ createdAt: -1 })
    .lean();
  return rawProjects.map((project) => ({
    _id: project._id.toString(),
    projectName: project.projectName,
    slug: project.slug,
    privacyPolicyContent: project.privacyPolicyContent,
  })) as IProjectDoc[];
});

export default async function Home() {
  const projects = await getProjects();

  return (
    <PublicShell>
        {/* Hero Section */}
        <section className="relative pt-12 sm:pt-16 lg:pt-20 pb-20 sm:pb-28 lg:pb-32 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                <div className="space-y-6 sm:space-y-8 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium dark:bg-blue-950/50 dark:border-blue-900 dark:text-blue-300">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Open to Work
                    </div>
                    
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                        Transforming Ideas into <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Digital Reality</span>.
                    </h1>
                    
                    <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
                        I am <span className="font-semibold text-slate-900 dark:text-white">Hussnain Ahmad</span>. A multi-disciplinary developer bridging the gap between Web, Mobile Apps, and Interactive Gaming.
                    </p>

                    <div className="flex flex-col xs:flex-row gap-3 sm:gap-4">
                        <Link href="#contact" className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 text-center dark:shadow-blue-900/30 dark:hover:shadow-blue-900/50">
                            Let&apos;s Collaborate
                        </Link>
                        <a
                            href="https://hussnainahmad.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-white text-slate-700 font-semibold border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm hover:shadow-md text-center dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:border-slate-600"
                        >
                            View Portfolio
                        </a>
                    </div>

                    <div className="pt-6 sm:pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                         <div className="flex items-start gap-3">
                            <div className="w-1 h-10 sm:h-12 bg-blue-200 dark:bg-blue-800 rounded-full shrink-0"></div>
                            <p className="text-slate-500 dark:text-slate-400 italic font-medium text-base sm:text-lg leading-snug">
                                &quot;Nothing is impossible, until you take the first step.&quot;
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side Visual */}
                <div className="relative h-[320px] sm:h-[400px] lg:h-[500px] w-full hidden md:block">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-slate-100 dark:from-blue-950 dark:to-slate-900 rounded-[2rem] transform rotate-3"></div>
                    <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
                        <div className="h-12 border-b border-slate-100 dark:border-slate-800 flex items-center px-6 gap-2 bg-slate-50/50 dark:bg-slate-800/50">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        
                        <div className="flex-1 p-6 lg:p-8 bg-slate-50/30 dark:bg-slate-950/30">
                            <div className="grid grid-cols-2 gap-4 lg:gap-6 h-full">
                                <div className="bg-white dark:bg-slate-900 p-4 lg:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-center hover:border-blue-200 dark:hover:border-blue-800 transition-colors group">
                                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-50 dark:bg-blue-950 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3 lg:mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <Globe size={22} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-base lg:text-lg">Web Development</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs lg:text-sm mt-2">Modern, responsive websites using Next.js & React.</p>
                                </div>
                                <div className="bg-white dark:bg-slate-900 p-4 lg:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-center hover:border-blue-200 dark:hover:border-blue-800 transition-colors group">
                                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-indigo-50 dark:bg-indigo-950 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3 lg:mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        <Smartphone size={22} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-base lg:text-lg">App Development</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs lg:text-sm mt-2">Cross-platform mobile experiences.</p>
                                </div>
                                <div className="col-span-2 bg-gradient-to-r from-slate-900 to-slate-800 p-4 lg:p-6 rounded-2xl shadow-lg text-white flex items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Gamepad2 size={20} className="text-blue-400" />
                                            <span className="font-bold text-blue-100 text-sm uppercase tracking-wider">Loading...</span>
                                        </div>
                                        <h3 className="font-bold text-lg lg:text-xl">Game Development</h3>
                                        <p className="text-slate-400 text-xs lg:text-sm mt-1">Expanding horizons into interactive worlds.</p>
                                    </div>
                                    <div className="h-14 w-14 lg:h-16 lg:w-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm shrink-0">
                                        <div className="w-7 h-7 lg:w-8 lg:h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Data Deletion Section */}
        <section className="border-t border-slate-100 dark:border-slate-800 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 py-14 sm:py-20">
            <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 sm:gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-12">
                <div className="max-w-3xl">
                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">User Rights</p>
                    <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">Request Account/Data Deletion</h2>
                    <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400">
                        Need your account data removed from one of our apps? Submit a secure deletion request with your account email and track it with a reference ID.
                    </p>
                </div>
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                    <Link
                        href="/request-data-deletion"
                        className="rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700 dark:shadow-blue-900/30"
                    >
                        Request Data Deletion
                    </Link>
                </div>
            </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-16 sm:py-24 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-12 gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">Privacy Policies For Apps</h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-xl text-base sm:text-lg">
                            A showcase of my recent work in web and mobile applications, complete with their privacy documentation.
                        </p>
                    </div>
                    <div className="hidden md:block">
                         <div className="h-1 w-24 bg-blue-600 rounded-full"></div>
                    </div>
                </div>

                {projects.length > 0 ? (
                    <ProjectsGrid projects={projects} />
                ) : (
                    <div className="grid">
                        <div className="col-span-full py-16 sm:py-20 bg-slate-50 dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center px-4">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4">
                                <Smartphone size={32} />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No Projects Yet</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-sm mt-2">Projects added via the admin dashboard will appear here automatically.</p>
                        </div>
                    </div>
                )}
            </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 sm:py-24 bg-slate-900 text-white">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
                <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
                    <div>
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6">Let&apos;s Build Something Amazing</h2>
                        <p className="text-slate-400 text-base sm:text-lg mb-8 sm:mb-12 leading-relaxed">
                            Whether you have a question, a project idea, or just want to say hi, I&apos;m always open to discussing new opportunities.
                        </p>
                        
                        <div className="space-y-5 sm:space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white">Quality Code</h4>
                                    <p className="text-sm text-slate-500">Built with modern best practices</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white">Timely Delivery</h4>
                                    <p className="text-sm text-slate-500">Respecting deadlines and milestones</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-white/10">
                        <div className="space-y-4 sm:space-y-6">
                            <a 
                                href="mailto:workwithhussnainahmad@gmail.com" 
                                className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-white/5 hover:bg-blue-600 transition-all group"
                            >
                                <Mail size={24} className="text-slate-300 group-hover:text-white shrink-0 sm:w-7 sm:h-7" />
                                <div className="min-w-0">
                                    <h3 className="text-base sm:text-lg font-semibold text-white">Email Me</h3>
                                    <p className="text-slate-400 text-xs sm:text-sm group-hover:text-blue-100 break-all">workwithhussnainahmad@gmail.com</p>
                                </div>
                            </a>

                            <a 
                                href="https://www.linkedin.com/in/hussnain-ahmad-sahi-b2b037396/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-white/5 hover:bg-[#0077b5] transition-all group"
                            >
                                <Linkedin size={24} className="text-slate-300 group-hover:text-white shrink-0 sm:w-7 sm:h-7" />
                                <div>
                                    <h3 className="text-base sm:text-lg font-semibold text-white">Connect on LinkedIn</h3>
                                    <p className="text-slate-400 text-xs sm:text-sm group-hover:text-blue-100">Hussnain Ahmad</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-12 sm:mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm text-center md:text-left gap-2">
                    <p>
                        &copy; {new Date().getFullYear()}{" "}
                        <a
                            href="https://hussnainahmad.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white underline underline-offset-2 transition-colors"
                        >
                            Hussnain Ahmad
                        </a>
                        . All rights reserved.
                    </p>
                    <div>
                        Made with Next.js & Tailwind CSS
                    </div>
                </div>
             </div>
        </section>
    </PublicShell>
  );
}
