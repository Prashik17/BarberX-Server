import { Schema, model, Document, Types } from "mongoose";

export interface Barber extends Document {
  salonId: Types.ObjectId;
  name: string;
  specialties: string[];
  experience: number;
  profilePicture?: string;
  phoneNumber?: string;
  email?: string;
  bio?: string;
  rating: {
    average: number;
    count: number;
  };
  availability: {
    day: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const barberSchema = new Schema<Barber>({
  salonId: { 
    type: Schema.Types.ObjectId, 
    ref: "Salon", 
    required: true 
  },
  name: { type: String, required: true },
  specialties: [{ type: String }],
  experience: { type: Number, default: 0 },
  profilePicture: { type: String },
  phoneNumber: { type: String },
  email: { type: String },
  bio: { type: String },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  availability: [{
    day: { 
      type: String, 
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      required: true
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isAvailable: { type: Boolean, default: true }
  }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

barberSchema.index({ salonId: 1 });
barberSchema.index({ name: 1 });
barberSchema.index({ isActive: 1 });

export const BarberModel = model<Barber>("Barber", barberSchema);