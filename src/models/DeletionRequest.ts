import mongoose, { Schema, Document, Model } from "mongoose";

export type DeletionStatus =
  | "pending_verification"
  | "verified"
  | "processing"
  | "completed"
  | "failed";

export interface IDeletionRequest extends Document {
  requestId: string;
  appId: string;
  email: string;
  emailMasked: string;
  status: DeletionStatus;
  verificationTokenHash?: string;
  verificationExpiresAt?: Date;
  attemptCount: number;
  lastAttemptAt?: Date;
  createdAt: Date;
  verifiedAt?: Date;
  completedAt?: Date;
  error?: string;
}

const DeletionRequestSchema = new Schema<IDeletionRequest>(
  {
    requestId: { type: String, required: true, unique: true, index: true },
    appId: { type: String, required: true, index: true },
    email: { type: String, required: true },
    emailMasked: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending_verification", "verified", "processing", "completed", "failed"],
      default: "pending_verification",
      required: true,
      index: true,
    },
    verificationTokenHash: { type: String, required: false },
    verificationExpiresAt: { type: Date, required: false },
    attemptCount: { type: Number, default: 0 },
    lastAttemptAt: { type: Date, required: false },
    verifiedAt: { type: Date, required: false },
    completedAt: { type: Date, required: false },
    error: { type: String, required: false },
  },
  { timestamps: true }
);

const DeletionRequest: Model<IDeletionRequest> =
  mongoose.models.DeletionRequest || mongoose.model<IDeletionRequest>("DeletionRequest", DeletionRequestSchema);

export default DeletionRequest;
