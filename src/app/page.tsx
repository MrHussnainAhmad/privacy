import Link from "next/link";
import { Mail, Linkedin, Gamepad2, Smartphone, Globe, CheckCircle2 } from "lucide-react";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import ProjectsGrid from "@/components/ProjectsGrid";

// Define the Project type for TypeScript
interface IProjectDoc {
  _id: string;
  projectName: string;
  slug: string;
  privacyPolicyContent?: string;
}

async function getProjects() {
  await dbConnect();
  const projects = await Project.find({}).sort({ createdAt: -1 }).lean();
  return projects as unknown as IProjectDoc[];
}

export default async function Home() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
        {/* Navigation */}
        <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="flex justify-between items-center h-16 px-6 lg:px-12 max-w-7xl mx-auto">
                <div className="font-bold text-xl tracking-tight text-slate-900 flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-serif italic">H</div>
                    AppsByHussnain
                </div>
                <div className="flex items-center gap-6">
                    <Link href="#projects" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors hidden sm:block">
                        Work
                    </Link>
                    <Link href="#contact" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors hidden sm:block">
                        Contact
                    </Link>
                </div>
            </div>
        </nav>

        {/* Hero Section */}
        <section className="relative pt-20 pb-32 px-6 lg:px-12 max-w-7xl mx-auto overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Open to Work
                    </div>
                    
                    <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                        Transforming Ideas into <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Digital Reality</span>.
                    </h1>
                    
                    <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
                        I am <span className="font-semibold text-slate-900">Hussnain Ahmad</span>. A multi-disciplinary developer bridging the gap between Web, Mobile Apps, and Interactive Gaming.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="#contact" className="px-8 py-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 text-center">
                            Let&apos;s Collaborate
                        </Link>
                        <Link href="#projects" className="px-8 py-4 rounded-xl bg-white text-slate-700 font-semibold border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm hover:shadow-md text-center">
                            View Portfolio
                        </Link>
                    </div>

                    <div className="pt-8 border-t border-slate-200 flex flex-col gap-2">
                         <div className="flex items-start gap-3">
                            <div className="w-1 h-12 bg-blue-200 rounded-full"></div>
                            <p className="text-slate-500 italic font-medium text-lg leading-snug">
                                &quot;Nothing is impossible, until you take the first step.&quot;
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side Visual */}
                <div className="relative h-[500px] w-full hidden lg:block">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-slate-100 rounded-[2rem] transform rotate-3"></div>
                    <div className="absolute inset-0 bg-white rounded-[2rem] border border-slate-100 shadow-2xl overflow-hidden flex flex-col">
                        {/* Fake Browser Header */}
                        <div className="h-12 border-b border-slate-100 flex items-center px-6 gap-2 bg-slate-50/50">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        
                        {/* Content Grid */}
                        <div className="flex-1 p-8 bg-slate-50/30">
                            <div className="grid grid-cols-2 gap-6 h-full">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center hover:border-blue-200 transition-colors group">
                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <Globe size={24} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-lg">Web Development</h3>
                                    <p className="text-slate-500 text-sm mt-2">Modern, responsive websites using Next.js & React.</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center hover:border-blue-200 transition-colors group">
                                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        <Smartphone size={24} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-lg">App Development</h3>
                                    <p className="text-slate-500 text-sm mt-2">Cross-platform mobile experiences.</p>
                                </div>
                                <div className="col-span-2 bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-2xl shadow-lg text-white flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Gamepad2 size={20} className="text-blue-400" />
                                            <span className="font-bold text-blue-100 text-sm uppercase tracking-wider">Loading...</span>
                                        </div>
                                        <h3 className="font-bold text-xl">Game Development</h3>
                                        <p className="text-slate-400 text-sm mt-1">Expanding horizons into interactive worlds.</p>
                                    </div>
                                    <div className="h-16 w-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                                        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-24 bg-white border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Privacy Policies For Apps</h2>
                        <p className="text-slate-600 max-w-xl text-lg">
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
                        <div className="col-span-full py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                                <Smartphone size={32} />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">No Projects Yet</h3>
                            <p className="text-slate-500 max-w-sm mt-2">Projects added via the admin dashboard will appear here automatically.</p>
                        </div>
                    </div>
                )}
            </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 bg-slate-900 text-white">
             <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Let&apos;s Build Something Amazing</h2>
                        <p className="text-slate-400 text-lg mb-12 leading-relaxed">
                            Whether you have a question, a project idea, or just want to say hi, I&apos;m always open to discussing new opportunities.
                        </p>
                        
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white">Quality Code</h4>
                                    <p className="text-sm text-slate-500">Built with modern best practices</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white">Timely Delivery</h4>
                                    <p className="text-sm text-slate-500">Respecting deadlines and milestones</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                        <div className="space-y-6">
                            <a 
                                href="mailto:workwithhussnainahmad@gmail.com" 
                                className="flex items-center gap-6 p-6 rounded-2xl bg-white/5 hover:bg-blue-600 transition-all group"
                            >
                                <Mail size={28} className="text-slate-300 group-hover:text-white" />
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Email Me</h3>
                                    <p className="text-slate-400 text-sm group-hover:text-blue-100">workwithhussnainahmad@gmail.com</p>
                                </div>
                            </a>

                            <a 
                                href="https://www.linkedin.com/in/hussnain-ahmad-sahi-b2b037396/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-6 p-6 rounded-2xl bg-white/5 hover:bg-[#0077b5] transition-all group"
                            >
                                <Linkedin size={28} className="text-slate-300 group-hover:text-white" />
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Connect on LinkedIn</h3>
                                    <p className="text-slate-400 text-sm group-hover:text-blue-100">Hussnain Ahmad</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} Hussnain Ahmad. All rights reserved.</p>
                    <div className="mt-4 md:mt-0">
                        Made with Next.js & Tailwind CSS
                    </div>
                </div>
             </div>
        </section>
    </div>
  );
}
