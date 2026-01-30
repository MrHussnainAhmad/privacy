"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false });

export default function ProjectEditor() {
    const params = useParams();
    const id = params?.id as string;
    const isNew = id === "new";

    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [project, setProject] = useState({
        projectName: "",
        slug: "",
        privacyPolicyContent: "",
    });

    const mdeOptions = useMemo(() => {
        return {
            spellChecker: false,
            placeholder: "Write your privacy policy here...",
            status: false,
        };
    }, []);

    useEffect(() => {
        if (!id) return;

        if (id === "new") {
            setLoading(false);
            return;
        }

        // Only fetch if we haven't loaded yet to prevent re-fetching/re-rendering loops
        // But since we have isNew check, it's fine.

        if (!isNew) {
            fetch(`/api/projects/${id}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.error) {
                        alert("Project not found");
                        router.push("/admin");
                    } else {
                        setProject(data);
                        setLoading(false);
                    }
                })
                .catch(() => {
                    alert("Error fetching project");
                    router.push("/admin");
                });
        }
    }, [id, isNew, router]);

    const handleSave = async () => {
        if (!project.projectName || !project.slug) {
            alert("Name and Slug are required");
            return;
        }

        setSaving(true);
        const method = isNew ? "POST" : "PUT";
        const url = isNew ? "/api/projects" : `/api/projects/${id}`;

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(project),
            });

            const data = await res.json();
            setSaving(false);

            if (data.error) {
                alert(data.error);
            } else {
                router.push("/admin");
            }
        } catch (err) {
            setSaving(false);
            alert("Failed to save");
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure?")) return;
        await fetch(`/api/projects/${id}`, { method: "DELETE" });
        router.push("/admin");
    }

    if (loading) return <div className="p-8 text-black">Loading...</div>;

    const publicUrl = typeof window !== 'undefined' ? `${window.location.origin}/privacy/${project.slug}` : `/privacy/${project.slug}`;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-4xl bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-black">{isNew ? "New Project" : "Edit Project"}</h1>
                    {!isNew && <button onClick={handleDelete} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete Project</button>}
                </div>

                <div className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-black">Project Name</label>
                            <input
                                type="text"
                                value={project.projectName}
                                onChange={(e) => setProject({ ...project, projectName: e.target.value })}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="My Awesome App"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-black">Slug (URL)</label>
                            <input
                                type="text"
                                value={project.slug}
                                onChange={(e) => setProject({ ...project, slug: e.target.value })}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="my-awesome-app"
                            />
                        </div>
                    </div>

                    {project.slug && (
                        <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between border border-blue-100">
                            <div>
                                <span className="text-xs font-semibold text-blue-800 uppercase tracking-wide">Public Link</span>
                                <div className="text-sm text-blue-900 mt-1 font-medium break-all">{publicUrl}</div>
                            </div>
                            <a href={`/privacy/${project.slug}`} target="_blank" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-semibold bg-white px-3 py-1.5 rounded border border-blue-200 shadow-sm">
                                View <ExternalLink size={14} />
                            </a>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-black mb-2">Privacy Policy Content (Markdown)</label>
                        <div className="prose-sm text-black">
                            <SimpleMDE
                                value={project.privacyPolicyContent}
                                onChange={(value) => setProject({ ...project, privacyPolicyContent: value })}
                                options={mdeOptions}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-100">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50 font-medium"
                        >
                            {saving ? "Saving..." : "Save Project"}
                        </button>
                        <button
                            onClick={() => router.back()}
                            className="rounded-md bg-white border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50 font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
