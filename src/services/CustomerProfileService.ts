import { CustomerProfileRepository } from "../repositories/CustomerProfileRepository";
import { CustomerProfile } from "../models/CustomerProfile";

export class CustomerProfileService {
  private customerProfileRepository = new CustomerProfileRepository();

  async createProfile(customerId: string, profileData: Partial<CustomerProfile>) {
    const existingProfile = await this.customerProfileRepository.findByCustomerId(customerId);
    if (existingProfile) {
      throw new Error("Customer already has a profile");
    }

    const profile = await this.customerProfileRepository.create({
      ...profileData,
      customerId
    });

    return profile;
  }

  async getProfileByCustomerId(customerId: string) {
    const profile = await this.customerProfileRepository.findByCustomerId(customerId);
    if (!profile) {
      throw new Error("Customer profile not found");
    }
    return profile;
  }

  async getProfileById(id: string) {
    const profile = await this.customerProfileRepository.findById(id);
    if (!profile) {
      throw new Error("Customer profile not found");
    }
    return profile;
  }

  async updateProfile(customerId: string, updateData: Partial<CustomerProfile>) {
    const profile = await this.customerProfileRepository.updateByCustomerId(customerId, updateData);
    if (!profile) {
      throw new Error("Customer profile not found or update failed");
    }
    return profile;
  }

  async updateProfileById(id: string, updateData: Partial<CustomerProfile>) {
    const profile = await this.customerProfileRepository.updateById(id, updateData);
    if (!profile) {
      throw new Error("Customer profile not found or update failed");
    }
    return profile;
  }

  async deleteProfile(customerId: string) {
    const profile = await this.customerProfileRepository.deleteByCustomerId(customerId);
    if (!profile) {
      throw new Error("Customer profile not found");
    }
    return { message: "Customer profile deleted successfully" };
  }

  async getAllProfiles(filter: any = {}) {
    return this.customerProfileRepository.getAllProfiles(filter);
  }

  async getActiveProfiles() {
    return this.customerProfileRepository.getActiveProfiles();
  }

  async searchProfiles(query: string) {
    if (!query || query.trim().length < 2) {
      throw new Error("Search query must be at least 2 characters long");
    }
    return this.customerProfileRepository.searchProfiles(query.trim());
  }

  async getProfilesByMembershipTier(tier: "bronze" | "silver" | "gold" | "platinum") {
    return this.customerProfileRepository.getProfilesByMembershipTier(tier);
  }

  async getTopLoyaltyCustomers(limit: number = 10) {
    return this.customerProfileRepository.getTopLoyaltyCustomers(limit);
  }

  async addLoyaltyPoints(customerId: string, points: number) {
    if (points <= 0) {
      throw new Error("Points must be a positive number");
    }
    return this.customerProfileRepository.updateLoyaltyPoints(customerId, points);
  }

  async deductLoyaltyPoints(customerId: string, points: number) {
    if (points <= 0) {
      throw new Error("Points must be a positive number");
    }
    return this.customerProfileRepository.updateLoyaltyPoints(customerId, -points);
  }

  async addBookingHistory(customerId: string, booking: {
    salonId: string;
    serviceId: string;
    date: Date;
    status: "completed" | "cancelled" | "no_show";
    rating?: number;
    review?: string;
  }) {
    const profile = await this.customerProfileRepository.addBookingHistory(customerId, booking);
    if (!profile) {
      throw new Error("Customer profile not found");
    }

    if (booking.status === "completed") {
      await this.addLoyaltyPoints(customerId, 10);
    }

    return profile;
  }

  async addPreferredSalon(customerId: string, salonId: string) {
    const profile = await this.customerProfileRepository.addPreferredSalon(customerId, salonId);
    if (!profile) {
      throw new Error("Customer profile not found");
    }
    return profile;
  }

  async removePreferredSalon(customerId: string, salonId: string) {
    const profile = await this.customerProfileRepository.removePreferredSalon(customerId, salonId);
    if (!profile) {
      throw new Error("Customer profile not found");
    }
    return profile;
  }

  async updateNotificationPreferences(customerId: string, notifications: {
    email?: boolean;
    sms?: boolean;
    push?: boolean;
  }) {
    const profile = await this.customerProfileRepository.updateNotificationPreferences(customerId, notifications);
    if (!profile) {
      throw new Error("Customer profile not found");
    }
    return profile;
  }

  async addFavoriteService(customerId: string, serviceName: string) {
    const profile = await this.customerProfileRepository.findByCustomerId(customerId);
    if (!profile) {
      throw new Error("Customer profile not found");
    }

    if (!profile.preferences.favoriteServices.includes(serviceName)) {
      profile.preferences.favoriteServices.push(serviceName);
      await profile.save();
    }

    return profile;
  }

  async removeFavoriteService(customerId: string, serviceName: string) {
    const profile = await this.customerProfileRepository.findByCustomerId(customerId);
    if (!profile) {
      throw new Error("Customer profile not found");
    }

    profile.preferences.favoriteServices = profile.preferences.favoriteServices.filter(
      service => service !== serviceName
    );
    await profile.save();

    return profile;
  }

  async updateEmergencyContact(customerId: string, emergencyContact: {
    name?: string;
    phoneNumber?: string;
    relationship?: string;
  }) {
    return this.customerProfileRepository.updateByCustomerId(customerId, {
      emergencyContact
    });
  }

  async deactivateProfile(customerId: string) {
    return this.customerProfileRepository.updateByCustomerId(customerId, {
      isActive: false
    });
  }

  async reactivateProfile(customerId: string) {
    return this.customerProfileRepository.updateByCustomerId(customerId, {
      isActive: true
    });
  }
}