import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProject extends Document {
    projectId?: string;
    projectName: string;
    slug: string;
    privacyPolicyContent: string;
    createdAt: Date;
    updatedAt: Date;
}

const ProjectSchema: Schema = new Schema({
    projectId: { type: String, required: false },
    projectName: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    privacyPolicyContent: { type: String, required: false, default: '' },
}, { timestamps: true });

const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
