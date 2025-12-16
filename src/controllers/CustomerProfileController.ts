import { Request, Response } from "express";
import { CustomerProfileService } from "../services/CustomerProfileService";
import { 
  CreateCustomerProfileDto, 
  UpdateCustomerProfileDto, 
  AddBookingDto, 
  UpdateNotificationPreferencesDto,
  AddFavoriteServiceDto,
  UpdateLoyaltyPointsDto
} from "../dtos/customerProfile.dto";
import { logger } from "../config/logger";

export class CustomerProfileController {
  private customerProfileService = new CustomerProfileService();

  /**
   * @swagger
   * /api/customer-profile:
   *   post:
   *     tags: [Customer Profile]
   *     summary: Create customer profile
   *     description: Create a new customer profile for the authenticated customer
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - firstName
   *               - lastName
   *             properties:
   *               firstName:
   *                 type: string
   *                 example: "Jane"
   *               lastName:
   *                 type: string
   *                 example: "Doe"
   *               phoneNumber:
   *                 type: string
   *                 example: "+1234567892"
   *               dateOfBirth:
   *                 type: string
   *                 format: date
   *                 example: "1990-05-15"
   *               gender:
   *                 type: string
   *                 enum: [male, female, other, prefer_not_to_say]
   *               profilePicture:
   *                 type: string
   *                 example: "https://example.com/customer-pic.jpg"
   *               preferences:
   *                 type: object
   *                 properties:
   *                   favoriteServices:
   *                     type: array
   *                     items:
   *                       type: string
   *                   notifications:
   *                     type: object
   *                     properties:
   *                       email:
   *                         type: boolean
   *                       sms:
   *                         type: boolean
   *                       push:
   *                         type: boolean
   *     responses:
   *       201:
   *         description: Profile created successfully
   *       400:
   *         description: Validation error
   *       401:
   *         description: Unauthorized
   */
  createProfile = async (req: Request, res: Response) => {
    try {
      const customerId = req.user?.id;
      if (!customerId) {
        return res.status(401).json({ 
          success: false,
          error: "Unauthorized" 
        });
      }

      const createProfileDto: CreateCustomerProfileDto = req.body;
      const profile = await this.customerProfileService.createProfile(customerId, createProfileDto);
      logger.info(`Customer profile created for customer: ${customerId}`);
      
      res.status(201).json({
        success: true,
        data: profile,
        message: "Customer profile created successfully"
      });
    } catch (error: any) {
      logger.error(`Create customer profile error: ${error.message}`);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  /**
   * @swagger
   * /api/customer-profile/my-profile:
   *   get:
   *     tags: [Customer Profile]
   *     summary: Get my profile
   *     description: Get the customer profile for the authenticated customer
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: Profile retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: object
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Profile not found
   */
  getMyProfile = async (req: Request, res: Response) => {
    try {
      const customerId = req.user?.id;
      if (!customerId) {
        return res.status(401).json({ 
          success: false,
          error: "Unauthorized" 
        });
      }

      const profile = await this.customerProfileService.getProfileByCustomerId(customerId);
      
      res.status(200).json({
        success: true,
        data: profile
      });
    } catch (error: any) {
      logger.error(`Get customer profile error: ${error.message}`);
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  };

  getProfileById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const profile = await this.customerProfileService.getProfileById(id);
      
      res.status(200).json({
        success: true,
        data: profile
      });
    } catch (error: any) {
      logger.error(`Get customer profile by ID error: ${error.message}`);
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  };

  updateMyProfile = async (req: Request, res: Response) => {
    try {
      const customerId = req.user?.id;
      if (!customerId) {
        return res.status(401).json({ 
          success: false,
          error: "Unauthorized" 
        });
      }

      const updateProfileDto: UpdateCustomerProfileDto = req.body;
      const profile = await this.customerProfileService.updateProfile(customerId, updateProfileDto);
      logger.info(`Customer profile updated for customer: ${customerId}`);
      
      res.status(200).json({
        success: true,
        data: profile,
        message: "Customer profile updated successfully"
      });
    } catch (error: any) {
      logger.error(`Update customer profile error: ${error.message}`);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  deleteMyProfile = async (req: Request, res: Response) => {
    try {
      const customerId = req.user?.id;
      if (!customerId) {
        return res.status(401).json({ 
          success: false,
          error: "Unauthorized" 
        });
      }

      const result = await this.customerProfileService.deleteProfile(customerId);
      logger.info(`Customer profile deleted for customer: ${customerId}`);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error: any) {
      logger.error(`Delete customer profile error: ${error.message}`);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  getAllProfiles = async (req: Request, res: Response) => {
    try {
      const { membershipTier, isActive } = req.query;
      const filter: any = {};
      
      if (membershipTier) filter.membershipTier = membershipTier;
      if (isActive !== undefined) filter.isActive = isActive === 'true';
      
      const profiles = await this.customerProfileService.getAllProfiles(filter);
      
      res.status(200).json({
        success: true,
        data: profiles,
        count: profiles.length
      });
    } catch (error: any) {
      logger.error(`Get all customer profiles error: ${error.message}`);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  getActiveProfiles = async (req: Request, res: Response) => {
    try {
      const profiles = await this.customerProfileService.getActiveProfiles();
      
      res.status(200).json({
        success: true,
        data: profiles,
        count: profiles.length
      });
    } catch (error: any) {
      logger.error(`Get active customer profiles error: ${error.message}`);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  searchProfiles = async (req: Request, res: Response) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({
          success: false,
          error: "Search query is required"
        });
      }

      const profiles = await this.customerProfileService.searchProfiles(q as string);
      
      res.status(200).json({
        success: true,
        data: profiles,
        count: profiles.length
      });
    } catch (error: any) {
      logger.error(`Search customer profiles error: ${error.message}`);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  getProfilesByMembershipTier = async (req: Request, res: Response) => {
    try {
      const { tier } = req.params;
      
      if (!["bronze", "silver", "gold", "platinum"].includes(tier)) {
        return res.status(400).json({
          success: false,
          error: "Invalid membership tier"
        });
      }

      const profiles = await this.customerProfileService.getProfilesByMembershipTier(
        tier as "bronze" | "silver" | "gold" | "platinum"
      );
      
      res.status(200).json({
        success: true,
        data: profiles,
        count: profiles.length
      });
    } catch (error: any) {
      logger.error(`Get profiles by membership tier error: ${error.message}`);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  getTopLoyaltyCustomers = async (req: Request, res: Response) => {
    try {
      const { limit } = req.query;
      const limitNum = limit ? parseInt(limit as string) : 10;
      
      const profiles = await this.customerProfileService.getTopLoyaltyCustomers(limitNum);
      
      res.status(200).json({
        success: true,
        data: profiles,
        count: profiles.length
      });
    } catch (error: any) {
      logger.error(`Get top loyalty customers error: ${error.message}`);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  updateLoyaltyPoints = async (req: Request, res: Response) => {
    try {
      const { customerId } = req.params;
      const { points, action }: UpdateLoyaltyPointsDto = req.body;

      let profile;
      if (action === "add") {
        profile = await this.customerProfileService.addLoyaltyPoints(customerId, points);
      } else {
        profile = await this.customerProfileService.deductLoyaltyPoints(customerId, points);
      }

      logger.info(`Loyalty points ${action}ed for customer: ${customerId}`);
      
      res.status(200).json({
        success: true,
        data: profile,
        message: `Loyalty points ${action}ed successfully`
      });
    } catch (error: any) {
      logger.error(`Update loyalty points error: ${error.message}`);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  addBookingHistory = async (req: Request, res: Response) => {
    try {
      const customerId = req.user?.id;
      if (!customerId) {
        return res.status(401).json({ 
          success: false,
          error: "Unauthorized" 
        });
      }

      const addBookingDto: AddBookingDto = req.body;
      const profile = await this.customerProfileService.addBookingHistory(customerId, addBookingDto);
      logger.info(`Booking history added for customer: ${customerId}`);
      
      res.status(200).json({
        success: true,
        data: profile,
        message: "Booking history added successfully"
      });
    } catch (error: any) {
      logger.error(`Add booking history error: ${error.message}`);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  addPreferredSalon = async (req: Request, res: Response) => {
    try {
      const customerId = req.user?.id;
      const { salonId } = req.params;
      
      if (!customerId) {
        return res.status(401).json({ 
          success: false,
          error: "Unauthorized" 
        });
      }

      const profile = await this.customerProfileService.addPreferredSalon(customerId, salonId);
      logger.info(`Preferred salon added for customer: ${customerId}`);
      
      res.status(200).json({
        success: true,
        data: profile,
        message: "Preferred salon added successfully"
      });
    } catch (error: any) {
      logger.error(`Add preferred salon error: ${error.message}`);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  removePreferredSalon = async (req: Request, res: Response) => {
    try {
      const customerId = req.user?.id;
      const { salonId } = req.params;
      
      if (!customerId) {
        return res.status(401).json({ 
          success: false,
          error: "Unauthorized" 
        });
      }

      const profile = await this.customerProfileService.removePreferredSalon(customerId, salonId);
      logger.info(`Preferred salon removed for customer: ${customerId}`);
      
      res.status(200).json({
        success: true,
        data: profile,
        message: "Preferred salon removed successfully"
      });
    } catch (error: any) {
      logger.error(`Remove preferred salon error: ${error.message}`);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  updateNotificationPreferences = async (req: Request, res: Response) => {
    try {
      const customerId = req.user?.id;
      if (!customerId) {
        return res.status(401).json({ 
          success: false,
          error: "Unauthorized" 
        });
      }

      const notificationDto: UpdateNotificationPreferencesDto = req.body;
      const profile = await this.customerProfileService.updateNotificationPreferences(customerId, notificationDto);
      logger.info(`Notification preferences updated for customer: ${customerId}`);
      
      res.status(200).json({
        success: true,
        data: profile,
        message: "Notification preferences updated successfully"
      });
    } catch (error: any) {
      logger.error(`Update notification preferences error: ${error.message}`);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  addFavoriteService = async (req: Request, res: Response) => {
    try {
      const customerId = req.user?.id;
      if (!customerId) {
        return res.status(401).json({ 
          success: false,
          error: "Unauthorized" 
        });
      }

      const { serviceName }: AddFavoriteServiceDto = req.body;
      const profile = await this.customerProfileService.addFavoriteService(customerId, serviceName);
      logger.info(`Favorite service added for customer: ${customerId}`);
      
      res.status(200).json({
        success: true,
        data: profile,
        message: "Favorite service added successfully"
      });
    } catch (error: any) {
      logger.error(`Add favorite service error: ${error.message}`);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  removeFavoriteService = async (req: Request, res: Response) => {
    try {
      const customerId = req.user?.id;
      const { serviceName } = req.params;
      
      if (!customerId) {
        return res.status(401).json({ 
          success: false,
          error: "Unauthorized" 
        });
      }

      const profile = await this.customerProfileService.removeFavoriteService(customerId, serviceName);
      logger.info(`Favorite service removed for customer: ${customerId}`);
      
      res.status(200).json({
        success: true,
        data: profile,
        message: "Favorite service removed successfully"
      });
    } catch (error: any) {
      logger.error(`Remove favorite service error: ${error.message}`);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  deactivateProfile = async (req: Request, res: Response) => {
    try {
      const customerId = req.user?.id;
      if (!customerId) {
        return res.status(401).json({ 
          success: false,
          error: "Unauthorized" 
        });
      }

      const profile = await this.customerProfileService.deactivateProfile(customerId);
      logger.info(`Customer profile deactivated for customer: ${customerId}`);
      
      res.status(200).json({
        success: true,
        data: profile,
        message: "Profile deactivated successfully"
      });
    } catch (error: any) {
      logger.error(`Deactivate profile error: ${error.message}`);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  reactivateProfile = async (req: Request, res: Response) => {
    try {
      const customerId = req.user?.id;
      if (!customerId) {
        return res.status(401).json({ 
          success: false,
          error: "Unauthorized" 
        });
      }

      const profile = await this.customerProfileService.reactivateProfile(customerId);
      logger.info(`Customer profile reactivated for customer: ${customerId}`);
      
      res.status(200).json({
        success: true,
        data: profile,
        message: "Profile reactivated successfully"
      });
    } catch (error: any) {
      logger.error(`Reactivate profile error: ${error.message}`);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };
}