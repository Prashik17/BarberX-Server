export interface CreateCustomerProfileDto {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  profilePicture?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  preferences?: {
    favoriteServices?: string[];
    notifications?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
    };
    hairType?: string;
    skinType?: string;
  };
  emergencyContact?: {
    name?: string;
    phoneNumber?: string;
    relationship?: string;
  };
}

export interface UpdateCustomerProfileDto {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  profilePicture?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  preferences?: {
    favoriteServices?: string[];
    notifications?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
    };
    hairType?: string;
    skinType?: string;
  };
  emergencyContact?: {
    name?: string;
    phoneNumber?: string;
    relationship?: string;
  };
}

export interface AddBookingDto {
  salonId: string;
  serviceId: string;
  date: Date;
  status: "completed" | "cancelled" | "no_show";
  rating?: number;
  review?: string;
}

export interface UpdateNotificationPreferencesDto {
  email?: boolean;
  sms?: boolean;
  push?: boolean;
}

export interface AddFavoriteServiceDto {
  serviceName: string;
}

export interface UpdateLoyaltyPointsDto {
  points: number;
  action: "add" | "deduct";
}

export interface SearchCustomerProfileDto {
  query?: string;
  membershipTier?: "bronze" | "silver" | "gold" | "platinum";
  isActive?: boolean;
}

export interface CustomerProfileResponseDto {
  id: string;
  customerId: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  gender?: string;
  profilePicture?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  preferences: {
    favoriteServices: string[];
    preferredSalons: string[];
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    hairType?: string;
    skinType?: string;
  };
  loyaltyPoints: number;
  membershipTier: string;
  emergencyContact?: {
    name?: string;
    phoneNumber?: string;
    relationship?: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerStatsDto {
  totalCustomers: number;
  activeCustomers: number;
  membershipDistribution: {
    bronze: number;
    silver: number;
    gold: number;
    platinum: number;
  };
  averageLoyaltyPoints: number;
}