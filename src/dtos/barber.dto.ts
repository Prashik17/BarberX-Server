export interface CreateBarberDto {
  name: string;
  specialties?: string[];
  experience?: number;
  profilePicture?: string;
  phoneNumber?: string;
  email?: string;
  bio?: string;
  availability?: {
    day: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }[];
}

export interface UpdateBarberDto {
  name?: string;
  specialties?: string[];
  experience?: number;
  profilePicture?: string;
  phoneNumber?: string;
  email?: string;
  bio?: string;
  availability?: {
    day: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }[];
}

export interface BarberResponseDto {
  id: string;
  salonId: string;
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

export interface SearchBarberDto {
  query?: string;
  specialty?: string;
  salonId?: string;
  minRating?: number;
  isActive?: boolean;
}

export interface UpdateAvailabilityDto {
  availability: {
    day: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }[];
}