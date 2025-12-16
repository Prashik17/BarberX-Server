export class SalonValidator {
  static validateCreateSalon(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.salonName || typeof data.salonName !== 'string' || data.salonName.trim().length < 2) {
      errors.push('Salon name is required and must be at least 2 characters long');
    }

    if (!data.address || typeof data.address !== 'string' || data.address.trim().length < 5) {
      errors.push('Address is required and must be at least 5 characters long');
    }

    if (!data.phoneNumber || typeof data.phoneNumber !== 'string') {
      errors.push('Phone number is required');
    }

    if (data.services && Array.isArray(data.services)) {
      data.services.forEach((service: any, index: number) => {
        if (!service.name || typeof service.name !== 'string') {
          errors.push(`Service ${index + 1}: Name is required`);
        }
        if (!service.price || typeof service.price !== 'number' || service.price <= 0) {
          errors.push(`Service ${index + 1}: Valid price is required`);
        }
        if (!service.duration || typeof service.duration !== 'number' || service.duration <= 0) {
          errors.push(`Service ${index + 1}: Valid duration is required`);
        }
      });
    }

    if (data.operatingHours && Array.isArray(data.operatingHours)) {
      const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      data.operatingHours.forEach((hours: any, index: number) => {
        if (!validDays.includes(hours.day)) {
          errors.push(`Operating hours ${index + 1}: Invalid day`);
        }
        if (!hours.openTime || !hours.closeTime) {
          errors.push(`Operating hours ${index + 1}: Open and close times are required`);
        }
      });
    }

    if (data.location && data.location.coordinates) {
      if (!Array.isArray(data.location.coordinates) || data.location.coordinates.length !== 2) {
        errors.push('Location coordinates must be an array of [longitude, latitude]');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateUpdateSalon(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (data.salonName !== undefined) {
      if (typeof data.salonName !== 'string' || data.salonName.trim().length < 2) {
        errors.push('Salon name must be at least 2 characters long');
      }
    }

    if (data.address !== undefined) {
      if (typeof data.address !== 'string' || data.address.trim().length < 5) {
        errors.push('Address must be at least 5 characters long');
      }
    }

    if (data.phoneNumber !== undefined) {
      if (typeof data.phoneNumber !== 'string') {
        errors.push('Phone number must be a string');
      }
    }

    if (data.services && Array.isArray(data.services)) {
      data.services.forEach((service: any, index: number) => {
        if (service.name && typeof service.name !== 'string') {
          errors.push(`Service ${index + 1}: Name must be a string`);
        }
        if (service.price && (typeof service.price !== 'number' || service.price <= 0)) {
          errors.push(`Service ${index + 1}: Price must be a positive number`);
        }
        if (service.duration && (typeof service.duration !== 'number' || service.duration <= 0)) {
          errors.push(`Service ${index + 1}: Duration must be a positive number`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateService(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
      errors.push('Service name is required and must be at least 2 characters long');
    }

    if (!data.price || typeof data.price !== 'number' || data.price <= 0) {
      errors.push('Service price is required and must be a positive number');
    }

    if (!data.duration || typeof data.duration !== 'number' || data.duration <= 0) {
      errors.push('Service duration is required and must be a positive number');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateStatusUpdate(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const validStatuses = ['pending', 'approved', 'rejected'];

    if (!data.status || !validStatuses.includes(data.status)) {
      errors.push('Status must be one of: pending, approved, rejected');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateBarber(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.barberName || typeof data.barberName !== 'string' || data.barberName.trim().length < 2) {
      errors.push('Barber name is required and must be at least 2 characters long');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateCreateBarber(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
      errors.push('Barber name is required and must be at least 2 characters long');
    }

    if (data.experience !== undefined && (typeof data.experience !== 'number' || data.experience < 0)) {
      errors.push('Experience must be a positive number');
    }

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Invalid email format');
    }

    if (data.specialties && !Array.isArray(data.specialties)) {
      errors.push('Specialties must be an array');
    }

    if (data.availability && Array.isArray(data.availability)) {
      const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      data.availability.forEach((avail: any, index: number) => {
        if (!validDays.includes(avail.day)) {
          errors.push(`Availability ${index + 1}: Invalid day`);
        }
        if (!avail.startTime || !avail.endTime) {
          errors.push(`Availability ${index + 1}: Start and end times are required`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateUpdateBarber(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (data.name !== undefined) {
      if (typeof data.name !== 'string' || data.name.trim().length < 2) {
        errors.push('Barber name must be at least 2 characters long');
      }
    }

    if (data.experience !== undefined && (typeof data.experience !== 'number' || data.experience < 0)) {
      errors.push('Experience must be a positive number');
    }

    if (data.email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Invalid email format');
    }

    if (data.specialties !== undefined && !Array.isArray(data.specialties)) {
      errors.push('Specialties must be an array');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateAvailability(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    if (!data.availability || !Array.isArray(data.availability)) {
      errors.push('Availability must be an array');
    } else {
      data.availability.forEach((avail: any, index: number) => {
        if (!validDays.includes(avail.day)) {
          errors.push(`Availability ${index + 1}: Invalid day`);
        }
        if (!avail.startTime || !avail.endTime) {
          errors.push(`Availability ${index + 1}: Start and end times are required`);
        }
        if (typeof avail.isAvailable !== 'boolean') {
          errors.push(`Availability ${index + 1}: isAvailable must be a boolean`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}