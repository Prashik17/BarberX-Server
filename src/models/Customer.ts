import { Schema, model, Document } from "mongoose";

export interface Customer extends Document {
  name: string;
  email: string;
  password: string;
  role: "customer";
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
}

const customerSchema = new Schema<Customer>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "customer" },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
});

export const CustomerModel = model<Customer>("Customer", customerSchema);
