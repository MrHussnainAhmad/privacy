import Link from "next/link";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { PlusCircle, FileText, Clock } from "lucide-react";

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/auth/login");
    }

    await dbConnect();
    // Ensure types are handled by mongoose/Next.js
    const projects = await Project.find({}).sort({ updatedAt: -1 }).lean();

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-6xl">
                <header className="mb-8 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <div className="flex gap-4">
                        <span className="self-center text-gray-600">Welcome, {session.user?.email}</span>
                        <Link
                            href="/admin/projects/new"
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
                        >
                            <PlusCircle size={20} />
                            New Project
                        </Link>
                    </div>
                </header>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-500">Total Projects</h3>
                        <p className="mt-2 text-3xl font-bold text-gray-900">{projects.length}</p>
                    </div>
                    {/* Add more stats if needed */}
                </div>

                <div className="mt-12">
                    <h2 className="mb-6 text-xl font-semibold text-gray-900">Recent Projects</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project: any) => (
                            <div key={project._id.toString()} className="group relative rounded-xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{project.projectName}</h3>
                                        <p className="text-sm text-gray-500">/{project.slug}</p>
                                    </div>
                                    <Link href={`/admin/projects/${project._id.toString()}`} className="text-gray-400 hover:text-blue-600">
                                        <FileText size={20} />
                                    </Link>
                                </div>
                                <div className="mt-4 flex items-center text-xs text-gray-400 gap-1">
                                    <Clock size={14} />
                                    <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <Link href={`/admin/projects/${project._id.toString()}`} className="text-sm text-blue-600 hover:underline">Edit</Link>
                                    <a href={`/privacy/${project.slug}`} target="_blank" className="text-sm text-gray-600 hover:underline">View Public</a>
                                </div>
                            </div>
                        ))}
                        {projects.length === 0 && (
                            <div className="col-span-full py-12 text-center text-gray-500">
                                No projects found. Create one to get started.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
