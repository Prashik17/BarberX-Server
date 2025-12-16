import { Schema, model, Document, Types } from "mongoose";
import { BarberModel } from "./Barber";

export interface Salon extends Document {
  ownerId: Types.ObjectId;
  salonName: string;
  address: string;
  phoneNumber: string;
  description?: string;
  profilePicture?: string;
  salonImages: string[];
  services: {
    name: string;
    price: number;
    duration: number;
    description?: string;
  }[];
  operatingHours: {
    day: string;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  }[];
  amenities: string[];
  ratings: {
    average: number;
    count: number;
  };
  status: "pending" | "approved" | "rejected";
  listingStatus: "listed" | "notListed";
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  createdAt: Date;
  updatedAt: Date;
}

const salonSchema = new Schema<Salon>({
  ownerId: { 
    type: Schema.Types.ObjectId, 
    ref: "Owner", 
    required: true,
    unique: true
  },
  salonName: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  description: { type: String },
  profilePicture: { type: String },
  salonImages: [{ type: String }],
  services: [{
    name: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
    description: { type: String }
  }],
  operatingHours: [{
    day: { 
      type: String, 
      required: true,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    },
    openTime: { type: String, required: true },
    closeTime: { type: String, required: true },
    isClosed: { type: Boolean, default: false }
  }],
  amenities: [{ type: String }],
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  status: { 
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  listingStatus: {
    type: String,
    enum: ["listed", "notListed"],
    default: "notListed",
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

salonSchema.index({ location: "2dsphere" });
salonSchema.index({ ownerId: 1 });
salonSchema.index({ listingStatus: 1 });

// Add virtual for barbers
salonSchema.virtual('barbers', {
  ref: 'Barber',
  localField: '_id',
  foreignField: 'salonId'
});

// Ensure virtual fields are serialized
salonSchema.set('toJSON', { virtuals: true });
salonSchema.set('toObject', { virtuals: true });

salonSchema.methods.updateListingStatus = async function() {
  const barberCount = await BarberModel.countDocuments({ salonId: this._id, isActive: true });
  this.listingStatus = barberCount > 0 ? "listed" : "notListed";
  return this.save();
};

export const SalonModel = model<Salon>("Salon", salonSchema);