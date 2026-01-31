import dbConnect from "@/lib/db";
import Project, { IProject } from "@/models/Project";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import { Metadata } from 'next';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    await dbConnect();
    const project = await Project.findOne({ slug }).lean() as unknown as IProject;

    if (!project) {
        return {
            title: 'Privacy Policy Not Found',
        };
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
    const project = await Project.findOne({ slug }).lean() as unknown as IProject;

    if (!project) {
        notFound();
    }

    const { projectName, privacyPolicyContent, updatedAt } = project;

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <div className="mx-auto max-w-3xl px-6 py-12 md:py-20 animate-in fade-in duration-500">
                <header className="mb-10 text-center border-b pb-8">
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">{projectName}</h1>
                    <p className="mt-4 text-lg text-gray-600 font-medium">Privacy Policy</p>
                    <div className="mt-2 flex justify-center text-sm text-gray-400">
                        <span>Last Updated: {new Date(updatedAt).toLocaleDateString()}</span>
                    </div>
                </header>

                <article className="prose prose-lg prose-slate mx-auto max-w-none prose-headings:font-bold prose-headings:text-gray-800 prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-p:text-gray-600 prose-li:text-gray-600">
                    <ReactMarkdown>{privacyPolicyContent}</ReactMarkdown>
                </article>

                <footer className="mt-16 border-t pt-8 text-center text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} {projectName}. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}
