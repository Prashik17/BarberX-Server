import { Schema, model, Document, Types } from "mongoose";

export interface CustomerProfile extends Document {
  customerId: Types.ObjectId;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  profilePicture?: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  preferences: {
    favoriteServices: string[];
    preferredSalons: Types.ObjectId[];
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    hairType?: string;
    skinType?: string;
  };
  bookingHistory: {
    salonId: Types.ObjectId;
    serviceId: string;
    date: Date;
    status: "completed" | "cancelled" | "no_show";
    rating?: number;
    review?: string;
  }[];
  loyaltyPoints: number;
  membershipTier: "bronze" | "silver" | "gold" | "platinum";
  emergencyContact: {
    name?: string;
    phoneNumber?: string;
    relationship?: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const customerProfileSchema = new Schema<CustomerProfile>({
  customerId: { 
    type: Schema.Types.ObjectId, 
    ref: "Customer", 
    required: true,
    unique: true
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String },
  dateOfBirth: { type: Date },
  gender: { 
    type: String,
    enum: ["male", "female", "other", "prefer_not_to_say"]
  },
  profilePicture: { type: String },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String, default: "US" }
  },
  preferences: {
    favoriteServices: [{ type: String }],
    preferredSalons: [{ type: Schema.Types.ObjectId, ref: "Salon" }],
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    hairType: { type: String },
    skinType: { type: String }
  },
  bookingHistory: [{
    salonId: { type: Schema.Types.ObjectId, ref: "Salon", required: true },
    serviceId: { type: String, required: true },
    date: { type: Date, required: true },
    status: { 
      type: String,
      enum: ["completed", "cancelled", "no_show"],
      required: true
    },
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String }
  }],
  loyaltyPoints: { type: Number, default: 0 },
  membershipTier: { 
    type: String,
    enum: ["bronze", "silver", "gold", "platinum"],
    default: "bronze"
  },
  emergencyContact: {
    name: { type: String },
    phoneNumber: { type: String },
    relationship: { type: String }
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

customerProfileSchema.index({ customerId: 1 });
customerProfileSchema.index({ "address.city": 1 });
customerProfileSchema.index({ membershipTier: 1 });
customerProfileSchema.index({ loyaltyPoints: -1 });

export const CustomerProfileModel = model<CustomerProfile>("CustomerProfile", customerProfileSchema);