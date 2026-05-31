import mongoose, { Schema, Document, Model } from "mongoose";

export type DeletionMode = "direct_api" | "verification_then_api";
export type AuthType = "bearer_jwt" | "api_key" | "service_token";

export interface IDeletionApp extends Document {
  appId: string;
  appName: string;
  logoUrl: string;
  backendBaseUrl: string;
  deletionMode: DeletionMode;
  deleteEndpoint: string;
  authType: AuthType;
  headersTemplate?: Record<string, string>;
  privacySlug?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DeletionAppSchema = new Schema<IDeletionApp>(
  {
    appId: { type: String, required: true, unique: true, index: true, trim: true },
    appName: { type: String, required: true, trim: true },
    logoUrl: { type: String, required: true, trim: true },
    backendBaseUrl: { type: String, required: true, trim: true },
    deletionMode: {
      type: String,
      enum: ["direct_api", "verification_then_api"],
      default: "verification_then_api",
      required: true,
    },
    deleteEndpoint: { type: String, required: true, trim: true },
    authType: {
      type: String,
      enum: ["bearer_jwt", "api_key", "service_token"],
      default: "service_token",
      required: true,
    },
    headersTemplate: { type: Schema.Types.Mixed, default: {} },
    privacySlug: { type: String, required: false, trim: true },
    isActive: { type: Boolean, default: true, required: true },
  },
  { timestamps: true }
);

const DeletionApp: Model<IDeletionApp> =
  mongoose.models.DeletionApp || mongoose.model<IDeletionApp>("DeletionApp", DeletionAppSchema);

export default DeletionApp;
