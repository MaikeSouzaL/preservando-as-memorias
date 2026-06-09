import mongoose, { Schema, Document, model, models } from "mongoose";

export interface ICurator extends Document {
  name: string;
  email: string;
  bio: string;
  theme: string;
  privacy: "public" | "protected" | "private";
  notifyVelas: boolean;
  notifyTributos: boolean;
  multiFactorEnabled: boolean;
  language: string;
  timezone: string;
  globalAudio: boolean;
  isAdmin?: boolean;
  avatarUrl?: string;
  password?: string;
  resetPasswordTokenHash?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CuratorSchema = new Schema<ICurator>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  bio: { type: String, default: "" },
  theme: { type: String, default: "noturno" },
  privacy: { type: String, enum: ["public", "protected", "private"], default: "public" },
  notifyVelas: { type: Boolean, default: true },
  notifyTributos: { type: Boolean, default: true },
  multiFactorEnabled: { type: Boolean, default: false },
  language: { type: String, default: "pt-BR" },
  timezone: { type: String, default: "GMT-3" },
  globalAudio: { type: Boolean, default: true },
  isAdmin: { type: Boolean, default: false },
  avatarUrl: { type: String },
  password: { type: String },
  resetPasswordTokenHash: { type: String, index: true },
  resetPasswordExpires: { type: Date },
}, { timestamps: true });

export const Curator = models.Curator || model<ICurator>("Curator", CuratorSchema);
