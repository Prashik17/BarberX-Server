import { Request, Response } from "express";
import { SalonService } from "../services/SalonService";
import { CreateSalonDto, UpdateSalonDto, AddServiceDto, UpdateServiceDto } from "../dtos/salon.dto";
import { logger } from "../config/logger";

export class SalonController {
  private salonService = new SalonService();

  /**
   * @swagger
   * /api/salon:
   *   post:
   *     tags: [Salon Management]
   *     summary: Create a new salon
   *     description: Create a new salon profile for the authenticated owner
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - salonName
   *               - address
   *               - phoneNumber
   *             properties:
   *               salonName:
   *                 type: string
   *                 example: "Elite Hair Studio"
   *               address:
   *                 type: string
   *                 example: "123 Main St, City, State 12345"
   *               phoneNumber:
   *                 type: string
   *                 example: "+1234567890"
   *               description:
   *                 type: string
   *                 example: "Premium hair salon with experienced stylists"
   *               profilePicture:
   *                 type: string
   *                 example: "https://example.com/salon-pic.jpg"
   *               services:
   *                 type: array
   *                 items:
   *                   type: object
   *                   required:
   *                     - name
   *                     - price
   *                     - duration
   *                   properties:
   *                     name:
   *                       type: string
   *                       example: "Haircut"
   *                     price:
   *                       type: number
   *                       example: 25.00
   *                     duration:
   *                       type: number
   *                       example: 30
   *                     description:
   *                       type: string
   *                       example: "Professional haircut"
   *                 example:
   *                   - name: "Haircut"
   *                     price: 25.00
   *                     duration: 30
   *                     description: "Professional haircut"
   *                   - name: "Hair Wash"
   *                     price: 15.00
   *                     duration: 15
   *                     description: "Hair washing service"
   *               operatingHours:
   *                 type: array
   *                 items:
   *                   type: object
   *                   required:
   *                     - day
   *                     - openTime
   *                     - closeTime
   *                     - isClosed
   *                   properties:
   *                     day:
   *                       type: string
   *                       enum: [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]
   *                       example: "Monday"
   *                     openTime:
   *                       type: string
   *                       example: "09:00"
   *                     closeTime:
   *                       type: string
   *                       example: "18:00"
   *                     isClosed:
   *                       type: boolean
   *                       example: false
   *                 example:
   *                   - day: "Monday"
   *                     openTime: "09:00"
   *                     closeTime: "18:00"
   *                     isClosed: false
   *                   - day: "Tuesday"
   *                     openTime: "09:00"
   *                     closeTime: "18:00"
   *                     isClosed: false
   *     responses:
   *       201:
   *         description: Salon created successfully
   *       400:
   *         description: Validation error
   *       401:
   *         description: Unauthorized
   */
  createSalon = async (req: Request, res: Response) => {
    try {
      const ownerId = req.user?.id;
      if (!ownerId) {
        return res.status(401).json({ 
          success: false,
          error: "Unauthorized" 
        });
      }

      const createSalonDto: CreateSalonDto = req.body;
      const salon = await this.salonService.createSalon(ownerId, createSalonDto);
      logger.info(`Salon created for owner: ${ownerId}`);
      
      res.status(201).json({
        success: true,
        data: salon,
        message: "Salon profile created successfully"
      });
    } catch (error: any) {
      logger.error(`Create salon error: ${error.message}`);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  /**
   * @swagger
   * /api/salon/my-salon:
   *   get:
   *     tags: [Salon Management]
   *     summary: Get my salon
   *     description: Get the salon profile for the authenticated owner
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: Salon retrieved successfully
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
   *         description: Salon not found
   */
  getMySalon = async (req: Request, res: Response) => {
    try {
      const ownerId = req.user?.id;
      if (!ownerId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const salon = await this.salonService.getSalonByOwnerId(ownerId);
      
      res.status(200).json({
        success: true,
        data: salon
      });
    } catch (error: any) {
      logger.error(`Get salon error: ${error.message}`);
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  };

  getSalonById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const salon = await this.salonService.getSalonById(id);
      
      res.status(200).json({
        success: true,
        data: salon
      });
    } catch (error: any) {
      logger.error(`Get salon by ID error: ${error.message}`);
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  };

  /**
   * @swagger
   * /api/salon/my-salon:
   *   put:
   *     tags: [Salon Management]
   *     summary: Update my salon
   *     description: Update salon profile for the authenticated owner
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               salonName:
   *                 type: string
   *               address:
   *                 type: string
   *               phoneNumber:
   *                 type: string
   *               description:
   *                 type: string
   *               profilePicture:
   *                 type: string
   *     responses:
   *       200:
   *         description: Salon updated successfully
   *       400:
   *         description: Validation error
   *       401:
   *         description: Unauthorized
   */
  updateMySalon = async (req: Request, res: Response) => {
    try {
      const ownerId = req.user?.id;
      if (!ownerId) {
        return res.status(401).json({ 
          success: false,
          error: "Unauthorized" 
        });
      }

      const updateSalonDto: UpdateSalonDto = req.body;
      const salon = await this.salonService.updateSalon(ownerId, updateSalonDto);
      logger.info(`Salon updated for owner: ${ownerId}`);
      
      res.status(200).json({
        success: true,
        data: salon,
        message: "Salon updated successfully"
      });
    } catch (error: any) {
      logger.error(`Update salon error: ${error.message}`);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  /**
   * @swagger
   * /api/salon/my-salon:
   *   delete:
   *     tags: [Salon Management]
   *     summary: Delete my salon
   *     description: Delete salon profile for the authenticated owner
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: Salon deleted successfully
   *       400:
   *         description: Error deleting salon
   *       401:
   *         description: Unauthorized
   */
  deleteMySalon = async (req: Request, res: Response) => {
    try {
      const ownerId = req.user?.id;
      if (!ownerId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const result = await this.salonService.deleteSalon(ownerId);
      logger.info(`Salon deleted for owner: ${ownerId}`);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error: any) {
      logger.error(`Delete salon error: ${error.message}`);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  /**
   * @swagger
   * /api/salon/all:
   *   get:
   *     tags: [Salon Management]
   *     summary: Get all salons
   *     description: Get all salons with optional status filter
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [pending, approved, rejected]
   *         description: Filter by salon status
   *     responses:
   *       200:
   *         description: Salons retrieved successfully
   *       500:
   *         description: Server error
   */
  getAllSalons = async (req: Request, res: Response) => {
    try {
      const { status } = req.query;
      const filter = status ? { status } : {};
      
      const salons = await this.salonService.getAllSalons(filter);
      
      res.status(200).json({
        success: true,
        data: salons,
        count: salons.length
      });
    } catch (error: any) {
      logger.error(`Get all salons error: ${error.message}`);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  getApprovedSalons = async (req: Request, res: Response) => {
    try {
      const salons = await this.salonService.getApprovedSalons();
      
      res.status(200).json({
        success: true,
        data: salons,
        count: salons.length
      });
    } catch (error: any) {
      logger.error(`Get approved salons error: ${error.message}`);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  /**
   * @swagger
   * /api/salon/listed:
   *   get:
   *     tags: [Salon Management]
   *     summary: Get listed salons
   *     description: Get all listed salons for the authenticated owner
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: Listed salons retrieved successfully
   *       500:
   *         description: Server error
   */
  getListedSalons = async (req: Request, res: Response) => {
    try {
      const salons = await this.salonService.getListedSalons();
      
      res.status(200).json({
        success: true,
        data: salons,
        count: salons.length
      });
    } catch (error: any) {
      logger.error(`Get listed salons error: ${error.message}`);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  getAllListedSalons = async (req: Request, res: Response) => {
    try {
      const salons = await this.salonService.getAllListedSalons();
      
      res.status(200).json({
        success: true,
        data: salons,
        count: salons.length
      });
    } catch (error: any) {
      logger.error(`Get all listed salons error: ${error.message}`);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  /**
   * @swagger
   * /api/salon/search:
   *   get:
   *     tags: [Salon Management]
   *     summary: Search salons
   *     description: Search salons by name or description
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: query
   *         name: q
   *         required: true
   *         schema:
   *           type: string
   *         description: Search query
   *     responses:
   *       200:
   *         description: Search results
   *       400:
   *         description: Missing search query
   */
  searchSalons = async (req: Request, res: Response) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({
          success: false,
          error: "Search query is required"
        });
      }

      const salons = await this.salonService.searchSalons(q as string);
      
      res.status(200).json({
        success: true,
        data: salons,
        count: salons.length
      });
    } catch (error: any) {
      logger.error(`Search salons error: ${error.message}`);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  getSalonsByLocation = async (req: Request, res: Response) => {
    try {
      const { latitude, longitude, maxDistance } = req.query;
      
      if (!latitude || !longitude) {
        return res.status(400).json({
          success: false,
          error: "Latitude and longitude are required"
        });
      }

      const salons = await this.salonService.getSalonsByLocation(
        parseFloat(latitude as string),
        parseFloat(longitude as string),
        maxDistance ? parseInt(maxDistance as string) : 5000
      );
      
      res.status(200).json({
        success: true,
        data: salons,
        count: salons.length
      });
    } catch (error: any) {
      logger.error(`Get salons by location error: ${error.message}`);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  updateSalonStatus = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({
          success: false,
          error: "Invalid status. Must be 'pending', 'approved', or 'rejected'"
        });
      }

      const salon = await this.salonService.updateSalonStatus(id, status);
      logger.info(`Salon ${id} status updated to: ${status}`);
      
      res.status(200).json({
        success: true,
        data: salon,
        message: `Salon status updated to ${status}`
      });
    } catch (error: any) {
      logger.error(`Update salon status error: ${error.message}`);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  /**
   * @swagger
   * /api/salon/services:
   *   post:
   *     tags: [Salon Management]
   *     summary: Add service to salon
   *     description: Add a new service to the salon
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - price
   *               - duration
   *             properties:
   *               name:
   *                 type: string
   *                 example: "Hair Coloring"
   *               price:
   *                 type: number
   *                 example: 50.00
   *               duration:
   *                 type: number
   *                 example: 60
   *               description:
   *                 type: string
   *                 example: "Professional hair coloring service"
   *     responses:
   *       200:
   *         description: Service added successfully
   *       400:
   *         description: Validation error
   *       401:
   *         description: Unauthorized
   */
  addService = async (req: Request, res: Response) => {
    try {
      const ownerId = req.user?.id;
      if (!ownerId) {
        return res.status(401).json({ 
          success: false,
          error: "Unauthorized" 
        });
      }

      const addServiceDto: AddServiceDto = req.body;
      const salon = await this.salonService.addService(ownerId, addServiceDto);
      logger.info(`Service added to salon for owner: ${ownerId}`);
      
      res.status(200).json({
        success: true,
        data: salon,
        message: "Service added successfully"
      });
    } catch (error: any) {
      logger.error(`Add service error: ${error.message}`);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  updateService = async (req: Request, res: Response) => {
    try {
      const ownerId = req.user?.id;
      const { serviceIndex } = req.params;
      
      if (!ownerId) {
        return res.status(401).json({ 
          success: false,
          error: "Unauthorized" 
        });
      }

      const updateServiceDto: UpdateServiceDto = req.body;
      const salon = await this.salonService.updateService(
        ownerId, 
        parseInt(serviceIndex), 
        updateServiceDto
      );
      logger.info(`Service updated in salon for owner: ${ownerId}`);
      
      res.status(200).json({
        success: true,
        data: salon,
        message: "Service updated successfully"
      });
    } catch (error: any) {
      logger.error(`Update service error: ${error.message}`);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  removeService = async (req: Request, res: Response) => {
    try {
      const ownerId = req.user?.id;
      const { serviceIndex } = req.params;
      
      if (!ownerId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const salon = await this.salonService.removeService(ownerId, parseInt(serviceIndex));
      logger.info(`Service removed from salon for owner: ${ownerId}`);
      
      res.status(200).json({
        success: true,
        data: salon,
        message: "Service removed successfully"
      });
    } catch (error: any) {
      logger.error(`Remove service error: ${error.message}`);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

}