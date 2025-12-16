import { Request, Response, NextFunction } from "express";
import { SalonValidator } from "../validators/salon.validator";
import { CustomerProfileValidator } from "../validators/customerProfile.validator";

export const validateCreateSalon = (req: Request, res: Response, next: NextFunction) => {
  const validation = SalonValidator.validateCreateSalon(req.body);
  
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validation.errors
    });
  }
  
  next();
};

export const validateUpdateSalon = (req: Request, res: Response, next: NextFunction) => {
  const validation = SalonValidator.validateUpdateSalon(req.body);
  
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validation.errors
    });
  }
  
  next();
};

export const validateService = (req: Request, res: Response, next: NextFunction) => {
  const validation = SalonValidator.validateService(req.body);
  
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validation.errors
    });
  }
  
  next();
};

export const validateStatusUpdate = (req: Request, res: Response, next: NextFunction) => {
  const validation = SalonValidator.validateStatusUpdate(req.body);
  
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validation.errors
    });
  }
  
  next();
};

export const validateSearchParams = (req: Request, res: Response, next: NextFunction) => {
  const { latitude, longitude, maxDistance } = req.query;
  
  if (latitude && isNaN(Number(latitude))) {
    return res.status(400).json({
      success: false,
      message: "Latitude must be a valid number"
    });
  }
  
  if (longitude && isNaN(Number(longitude))) {
    return res.status(400).json({
      success: false,
      message: "Longitude must be a valid number"
    });
  }
  
  if (maxDistance && isNaN(Number(maxDistance))) {
    return res.status(400).json({
      success: false,
      message: "Max distance must be a valid number"
    });
  }
  
  next();
};

export const validateCreateCustomerProfile = (req: Request, res: Response, next: NextFunction) => {
  const validation = CustomerProfileValidator.validateCreateProfile(req.body);
  
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validation.errors
    });
  }
  
  next();
};

export const validateUpdateCustomerProfile = (req: Request, res: Response, next: NextFunction) => {
  const validation = CustomerProfileValidator.validateUpdateProfile(req.body);
  
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validation.errors
    });
  }
  
  next();
};

export const validateAddBooking = (req: Request, res: Response, next: NextFunction) => {
  const validation = CustomerProfileValidator.validateAddBooking(req.body);
  
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validation.errors
    });
  }
  
  next();
};

export const validateNotificationPreferences = (req: Request, res: Response, next: NextFunction) => {
  const validation = CustomerProfileValidator.validateNotificationPreferences(req.body);
  
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validation.errors
    });
  }
  
  next();
};

export const validateFavoriteService = (req: Request, res: Response, next: NextFunction) => {
  const validation = CustomerProfileValidator.validateFavoriteService(req.body);
  
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validation.errors
    });
  }
  
  next();
};

export const validateLoyaltyPoints = (req: Request, res: Response, next: NextFunction) => {
  const validation = CustomerProfileValidator.validateLoyaltyPoints(req.body);
  
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validation.errors
    });
  }
  
  next();
};

export const validateCustomerSearchParams = (req: Request, res: Response, next: NextFunction) => {
  const validation = CustomerProfileValidator.validateSearchParams(req.query);
  
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validation.errors
    });
  }
  
  next();
};

export const validateBarber = (req: Request, res: Response, next: NextFunction) => {
  const validation = SalonValidator.validateBarber(req.body);
  
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validation.errors
    });
  }
  
  next();
};

export const validateCreateBarber = (req: Request, res: Response, next: NextFunction) => {
  const validation = SalonValidator.validateCreateBarber(req.body);
  
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validation.errors
    });
  }
  
  next();
};

export const validateUpdateBarber = (req: Request, res: Response, next: NextFunction) => {
  const validation = SalonValidator.validateUpdateBarber(req.body);
  
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validation.errors
    });
  }
  
  next();
};

export const validateAvailability = (req: Request, res: Response, next: NextFunction) => {
  const validation = SalonValidator.validateAvailability(req.body);
  
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validation.errors
    });
  }
  
  next();
};