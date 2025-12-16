export interface CreateSalonDto {
  salonName: string;
  address: string;
  phoneNumber: string;
  description?: string;
  profilePicture?: string;
  salonImages?: string[];
  barbers?: string[];
  services?: {
    name: string;
    price: number;
    duration: number;
    description?: string;
  }[];
  operatingHours?: {
    day: string;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  }[];
  amenities?: string[];
  location?: {
    coordinates: [number, number];
  };
}

export interface UpdateSalonDto {
  salonName?: string;
  address?: string;
  phoneNumber?: string;
  description?: string;
  profilePicture?: string;
  salonImages?: string[];
  barbers?: string[];
  operatingHours?: {
    day: string;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  }[];
  amenities?: string[];
  location?: {
    coordinates: [number, number];
  };
}

export interface AddServiceDto {
  name: string;
  price: number;
  duration: number;
  description?: string;
}

export interface UpdateServiceDto {
  name?: string;
  price?: number;
  duration?: number;
  description?: string;
}

export interface SearchSalonDto {
  q?: string;
  latitude?: number;
  longitude?: number;
  maxDistance?: number;
  status?: "pending" | "approved" | "rejected";
}

export interface UpdateSalonStatusDto {
  status: "pending" | "approved" | "rejected";
}

