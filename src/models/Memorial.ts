import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IMemorial extends Document {
  ownerId: string;
  name: string;
  nickname?: string;
  birthDate?: string;
  deathDate?: string;
  city?: string;
  epitaph: string;
  biography: string;
  imageUrl: string;
  audioUrl?: string;
  status: "ativo" | "rascunho";
  visits: number;
  gallery: Array<{ id: string; title: string; url: string }>;
  timelineEvents: Array<{
    id: string;
    year: string;
    title: string;
    description: string;
    longStory: string;
    imageUrl: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const MemorialSchema = new Schema<IMemorial>({
  ownerId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  nickname: { type: String },
  birthDate: { type: String },
  deathDate: { type: String },
  city: { type: String },
  epitaph: { type: String, default: "" },
  biography: { type: String, required: true },
  imageUrl: { type: String, required: true },
  audioUrl: { type: String },
  status: { type: String, enum: ["ativo", "rascunho"], default: "ativo" },
  visits: { type: Number, default: 0 },
  gallery: [{
    id: { type: String, required: true },
    title: { type: String, required: true },
    url: { type: String, required: true }
  }],
  timelineEvents: [{
    id: { type: String, required: true },
    year: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    longStory: { type: String, required: true },
    imageUrl: { type: String, required: true }
  }]
}, { timestamps: true });

export const Memorial = models.Memorial || model<IMemorial>("Memorial", MemorialSchema);
