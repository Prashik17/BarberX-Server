export class CustomerProfileValidator {
  static validateCreateProfile(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.firstName || typeof data.firstName !== 'string' || data.firstName.trim().length < 2) {
      errors.push('First name is required and must be at least 2 characters long');
    }

    if (!data.lastName || typeof data.lastName !== 'string' || data.lastName.trim().length < 2) {
      errors.push('Last name is required and must be at least 2 characters long');
    }

    if (data.phoneNumber && typeof data.phoneNumber !== 'string') {
      errors.push('Phone number must be a string');
    }

    if (data.dateOfBirth && !this.isValidDate(data.dateOfBirth)) {
      errors.push('Date of birth must be a valid date');
    }

    if (data.gender && !['male', 'female', 'other', 'prefer_not_to_say'].includes(data.gender)) {
      errors.push('Gender must be one of: male, female, other, prefer_not_to_say');
    }

    if (data.address && typeof data.address === 'object') {
      if (data.address.zipCode && !/^\d{5}(-\d{4})?$/.test(data.address.zipCode)) {
        errors.push('ZIP code must be in format 12345 or 12345-6789');
      }
    }

    if (data.preferences && typeof data.preferences === 'object') {
      if (data.preferences.notifications && typeof data.preferences.notifications === 'object') {
        const { email, sms, push } = data.preferences.notifications;
        if (email !== undefined && typeof email !== 'boolean') {
          errors.push('Email notification preference must be a boolean');
        }
        if (sms !== undefined && typeof sms !== 'boolean') {
          errors.push('SMS notification preference must be a boolean');
        }
        if (push !== undefined && typeof push !== 'boolean') {
          errors.push('Push notification preference must be a boolean');
        }
      }

      if (data.preferences.favoriteServices && !Array.isArray(data.preferences.favoriteServices)) {
        errors.push('Favorite services must be an array');
      }
    }

    if (data.emergencyContact && typeof data.emergencyContact === 'object') {
      if (data.emergencyContact.name && typeof data.emergencyContact.name !== 'string') {
        errors.push('Emergency contact name must be a string');
      }
      if (data.emergencyContact.phoneNumber && typeof data.emergencyContact.phoneNumber !== 'string') {
        errors.push('Emergency contact phone number must be a string');
      }
      if (data.emergencyContact.relationship && typeof data.emergencyContact.relationship !== 'string') {
        errors.push('Emergency contact relationship must be a string');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateUpdateProfile(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (data.firstName !== undefined) {
      if (typeof data.firstName !== 'string' || data.firstName.trim().length < 2) {
        errors.push('First name must be at least 2 characters long');
      }
    }

    if (data.lastName !== undefined) {
      if (typeof data.lastName !== 'string' || data.lastName.trim().length < 2) {
        errors.push('Last name must be at least 2 characters long');
      }
    }

    if (data.phoneNumber !== undefined && typeof data.phoneNumber !== 'string') {
      errors.push('Phone number must be a string');
    }

    if (data.dateOfBirth !== undefined && !this.isValidDate(data.dateOfBirth)) {
      errors.push('Date of birth must be a valid date');
    }

    if (data.gender !== undefined && !['male', 'female', 'other', 'prefer_not_to_say'].includes(data.gender)) {
      errors.push('Gender must be one of: male, female, other, prefer_not_to_say');
    }

    if (data.address !== undefined && typeof data.address === 'object') {
      if (data.address.zipCode && !/^\d{5}(-\d{4})?$/.test(data.address.zipCode)) {
        errors.push('ZIP code must be in format 12345 or 12345-6789');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateAddBooking(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.salonId || typeof data.salonId !== 'string') {
      errors.push('Salon ID is required');
    }

    if (!data.serviceId || typeof data.serviceId !== 'string') {
      errors.push('Service ID is required');
    }

    if (!data.date || !this.isValidDate(data.date)) {
      errors.push('Valid booking date is required');
    }

    if (!data.status || !['completed', 'cancelled', 'no_show'].includes(data.status)) {
      errors.push('Status must be one of: completed, cancelled, no_show');
    }

    if (data.rating !== undefined) {
      if (typeof data.rating !== 'number' || data.rating < 1 || data.rating > 5) {
        errors.push('Rating must be a number between 1 and 5');
      }
    }

    if (data.review !== undefined && typeof data.review !== 'string') {
      errors.push('Review must be a string');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateNotificationPreferences(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (data.email !== undefined && typeof data.email !== 'boolean') {
      errors.push('Email notification preference must be a boolean');
    }

    if (data.sms !== undefined && typeof data.sms !== 'boolean') {
      errors.push('SMS notification preference must be a boolean');
    }

    if (data.push !== undefined && typeof data.push !== 'boolean') {
      errors.push('Push notification preference must be a boolean');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateFavoriteService(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.serviceName || typeof data.serviceName !== 'string' || data.serviceName.trim().length < 2) {
      errors.push('Service name is required and must be at least 2 characters long');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateLoyaltyPoints(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.points || typeof data.points !== 'number' || data.points <= 0) {
      errors.push('Points must be a positive number');
    }

    if (!data.action || !['add', 'deduct'].includes(data.action)) {
      errors.push('Action must be either "add" or "deduct"');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateSearchParams(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (data.query !== undefined && (typeof data.query !== 'string' || data.query.trim().length < 2)) {
      errors.push('Search query must be at least 2 characters long');
    }

    if (data.membershipTier !== undefined && !['bronze', 'silver', 'gold', 'platinum'].includes(data.membershipTier)) {
      errors.push('Membership tier must be one of: bronze, silver, gold, platinum');
    }

    if (data.isActive !== undefined && typeof data.isActive !== 'boolean') {
      errors.push('isActive must be a boolean');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private static isValidDate(date: any): boolean {
    if (!date) return false;
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
  }
}