import { CustomerProfile, CustomerProfileModel } from "../models/CustomerProfile";
import { Types } from "mongoose";

export class CustomerProfileRepository {
  async findByCustomerId(customerId: string) {
    return CustomerProfileModel.findOne({ customerId: new Types.ObjectId(customerId) })
      .populate('customerId', 'name email')
      .populate('preferences.preferredSalons', 'salonName address');
  }

  async findById(id: string) {
    return CustomerProfileModel.findById(id)
      .populate('customerId', 'name email')
      .populate('preferences.preferredSalons', 'salonName address');
  }

  async create(data: Partial<CustomerProfile>) {
    return CustomerProfileModel.create(data);
  }

  async updateById(id: string, data: Partial<CustomerProfile>) {
    return CustomerProfileModel.findByIdAndUpdate(
      id, 
      { ...data, updatedAt: new Date() }, 
      { new: true }
    ).lean();
  }

  async updateByCustomerId(customerId: string, data: Partial<CustomerProfile>) {
    return CustomerProfileModel.findOneAndUpdate(
      { customerId: new Types.ObjectId(customerId) }, 
      { ...data, updatedAt: new Date() }, 
      { new: true }
    ).lean();
  }

  async deleteById(id: string) {
    return CustomerProfileModel.findByIdAndDelete(id);
  }

  async deleteByCustomerId(customerId: string) {
    return CustomerProfileModel.findOneAndDelete({ customerId: new Types.ObjectId(customerId) });
  }

  async getAllProfiles(filter: any = {}) {
    return CustomerProfileModel.find(filter)
      .populate('customerId', 'name email')
      .sort({ createdAt: -1 });
  }

  async getActiveProfiles() {
    return CustomerProfileModel.find({ isActive: true })
      .populate('customerId', 'name email')
      .sort({ createdAt: -1 });
  }

  async searchProfiles(query: string) {
    return CustomerProfileModel.find({
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { phoneNumber: { $regex: query, $options: 'i' } },
        { 'address.city': { $regex: query, $options: 'i' } }
      ],
      isActive: true
    }).populate('customerId', 'name email');
  }

  async getProfilesByMembershipTier(tier: "bronze" | "silver" | "gold" | "platinum") {
    return CustomerProfileModel.find({ membershipTier: tier, isActive: true })
      .populate('customerId', 'name email')
      .sort({ loyaltyPoints: -1 });
  }

  async getTopLoyaltyCustomers(limit: number = 10) {
    return CustomerProfileModel.find({ isActive: true })
      .populate('customerId', 'name email')
      .sort({ loyaltyPoints: -1 })
      .limit(limit);
  }

  async updateLoyaltyPoints(customerId: string, points: number) {
    const profile = await CustomerProfileModel.findOne({ customerId: new Types.ObjectId(customerId) });
    if (!profile) {
      throw new Error("Customer profile not found");
    }

    profile.loyaltyPoints += points;
    
    if (profile.loyaltyPoints >= 5000) {
      profile.membershipTier = "platinum";
    } else if (profile.loyaltyPoints >= 2000) {
      profile.membershipTier = "gold";
    } else if (profile.loyaltyPoints >= 500) {
      profile.membershipTier = "silver";
    } else {
      profile.membershipTier = "bronze";
    }

    return profile.save();
  }

  async addBookingHistory(customerId: string, booking: {
    salonId: string;
    serviceId: string;
    date: Date;
    status: "completed" | "cancelled" | "no_show";
    rating?: number;
    review?: string;
  }) {
    return CustomerProfileModel.findOneAndUpdate(
      { customerId: new Types.ObjectId(customerId) },
      { 
        $push: { bookingHistory: booking },
        updatedAt: new Date()
      },
      { new: true }
    );
  }

  async addPreferredSalon(customerId: string, salonId: string) {
    return CustomerProfileModel.findOneAndUpdate(
      { customerId: new Types.ObjectId(customerId) },
      { 
        $addToSet: { 'preferences.preferredSalons': new Types.ObjectId(salonId) },
        updatedAt: new Date()
      },
      { new: true }
    );
  }

  async removePreferredSalon(customerId: string, salonId: string) {
    return CustomerProfileModel.findOneAndUpdate(
      { customerId: new Types.ObjectId(customerId) },
      { 
        $pull: { 'preferences.preferredSalons': new Types.ObjectId(salonId) },
        updatedAt: new Date()
      },
      { new: true }
    );
  }

  async updateNotificationPreferences(customerId: string, notifications: {
    email?: boolean;
    sms?: boolean;
    push?: boolean;
  }) {
    return CustomerProfileModel.findOneAndUpdate(
      { customerId: new Types.ObjectId(customerId) },
      { 
        $set: {
          'preferences.notifications': notifications,
          updatedAt: new Date()
        }
      },
      { new: true }
    );
  }
}