import { Schema, model, Document } from "mongoose";

export interface Owner extends Document {
  name: string;
  email: string;
  password: string;
  role: "owner";
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  phoneNumber: string;
  profilePicture?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
}

const ownerSchema = new Schema<Owner>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "owner" },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
  phoneNumber: { type: String, required: true },
  profilePicture: { type: String, required: false },
  status: { 
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export const OwnerModel = model<Owner>("Owner", ownerSchema);
