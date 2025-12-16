import { Request, Response } from "express";
import { BarberService } from "../services/BarberService";
import { CreateBarberDto, UpdateBarberDto, UpdateAvailabilityDto } from "../dtos/barber.dto";
import { logger } from "../config/logger";

export class BarberController {
  private barberService = new BarberService();

  /**
   * @swagger
   * /api/owner/barber:
   *   post:
   *     tags: [Barber Management]
   *     summary: Create a new barber
   *     description: Create a new barber profile for the salon
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
   *             properties:
   *               name:
   *                 type: string
   *                 example: "Mike Johnson"
   *               specialties:
   *                 type: array
   *                 items:
   *                   type: string
   *                 example: ["Haircut", "Beard Trim", "Styling"]
   *               experience:
   *                 type: number
   *                 example: 5
   *               phoneNumber:
   *                 type: string
   *                 example: "+1234567891"
   *               email:
   *                 type: string
   *                 example: "mike@salon.com"
   *               bio:
   *                 type: string
   *                 example: "Experienced barber with 5 years in the industry"
   *     responses:
   *       201:
   *         description: Barber created successfully
   *       400:
   *         description: Validation error
   *       401:
   *         description: Unauthorized
   */
  createBarber = async (req: Request, res: Response) => {
    try {
      const ownerId = req.user?.id;
      if (!ownerId) {
        return res.status(401).json({ 
          success: false,
          error: "Unauthorized" 
        });
      }

      const createBarberDto: CreateBarberDto = req.body;
      const barber = await this.barberService.createBarber(ownerId, createBarberDto);
      logger.info(`Barber created for salon owner: ${ownerId}`);
      
      res.status(201).json({
        success: true,
        data: barber,
        message: "Barber created successfully"
      });
    } catch (error: any) {
      logger.error(`Create barber error: ${error.message}`);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  /**
   * @swagger
   * /api/owner/barber/{id}:
   *   get:
   *     tags: [Barber Management]
   *     summary: Get barber by ID
   *     description: Get a specific barber by ID
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Barber ID
   *     responses:
   *       200:
   *         description: Barber retrieved successfully
   *       404:
   *         description: Barber not found
   */
  getBarberById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const barber = await this.barberService.getBarberById(id);
      
      res.status(200).json({
        success: true,
        data: barber
      });
    } catch (error: any) {
      logger.error(`Get barber by ID error: ${error.message}`);
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  };

  /**
   * @swagger
   * /api/owner/barber/my-barbers:
   *   get:
   *     tags: [Barber Management]
   *     summary: Get my barbers
   *     description: Get all barbers for the authenticated salon owner
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: Barbers retrieved successfully
   *       401:
   *         description: Unauthorized
   */
  getMyBarbers = async (req: Request, res: Response) => {
    try {
      const ownerId = req.user?.id;
      if (!ownerId) {
        return res.status(401).json({ 
          success: false,
          error: "Unauthorized" 
        });
      }

      const barbers = await this.barberService.getBarbersByOwnerId(ownerId);
      
      res.status(200).json({
        success: true,
        data: barbers,
        count: barbers.length
      });
    } catch (error: any) {
      logger.error(`Get owner barbers error: ${error.message}`);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  /**
   * @swagger
   * /api/public/barbers/salon/{salonId}:
   *   get:
   *     tags: [Public Barber Discovery]
   *     summary: Get barbers by salon
   *     description: Get all barbers working at a specific salon
   *     parameters:
   *       - in: path
   *         name: salonId
   *         required: true
   *         schema:
   *           type: string
   *         description: Salon ID
   *     responses:
   *       200:
   *         description: Salon barbers retrieved
   *       400:
   *         description: Invalid salon ID
   */
  getBarbersBySalon = async (req: Request, res: Response) => {
    try {
      const { salonId } = req.params;
      const barbers = await this.barberService.getBarbersBySalonId(salonId);
      
      res.status(200).json({
        success: true,
        data: barbers,
        count: barbers.length
      });
    } catch (error: any) {
      logger.error(`Get salon barbers error: ${error.message}`);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  updateBarber = async (req: Request, res: Response) => {
    try {
      const ownerId = req.user?.id;
      const { id } = req.params;
      
      if (!ownerId) {
        return res.status(401).json({ 
          success: false,
          error: "Unauthorized" 
        });
      }

      const updateBarberDto: UpdateBarberDto = req.body;
      const barber = await this.barberService.updateBarber(id, ownerId, updateBarberDto);
      logger.info(`Barber ${id} updated by owner: ${ownerId}`);
      
      res.status(200).json({
        success: true,
        data: barber,
        message: "Barber updated successfully"
      });
    } catch (error: any) {
      logger.error(`Update barber error: ${error.message}`);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  deleteBarber = async (req: Request, res: Response) => {
    try {
      const ownerId = req.user?.id;
      const { id } = req.params;
      
      if (!ownerId) {
        return res.status(401).json({ 
          success: false,
          error: "Unauthorized" 
        });
      }

      const result = await this.barberService.deleteBarber(id, ownerId);
      logger.info(`Barber ${id} deleted by owner: ${ownerId}`);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error: any) {
      logger.error(`Delete barber error: ${error.message}`);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  /**
   * @swagger
   * /api/public/barbers:
   *   get:
   *     tags: [Public Barber Discovery]
   *     summary: Get all barbers
   *     description: Get all active barbers with optional filters
   *     parameters:
   *       - in: query
   *         name: specialty
   *         schema:
   *           type: string
   *         description: Filter by specialty
   *       - in: query
   *         name: isActive
   *         schema:
   *           type: boolean
   *         description: Filter by active status
   *     responses:
   *       200:
   *         description: Barbers retrieved successfully
   *       500:
   *         description: Server error
   */
  getAllBarbers = async (req: Request, res: Response) => {
    try {
      const { specialty, isActive } = req.query;
      const filter: any = {};
      
      if (specialty) filter.specialties = { $regex: specialty, $options: 'i' };
      if (isActive !== undefined) filter.isActive = isActive === 'true';
      
      const barbers = await this.barberService.getAllBarbers(filter);
      
      res.status(200).json({
        success: true,
        data: barbers,
        count: barbers.length
      });
    } catch (error: any) {
      logger.error(`Get all barbers error: ${error.message}`);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  /**
   * @swagger
   * /api/public/barbers/search:
   *   get:
   *     tags: [Public Barber Discovery]
   *     summary: Search barbers
   *     description: Search barbers by name or specialty
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
  searchBarbers = async (req: Request, res: Response) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({
          success: false,
          error: "Search query is required"
        });
      }

      const barbers = await this.barberService.searchBarbers(q as string);
      
      res.status(200).json({
        success: true,
        data: barbers,
        count: barbers.length
      });
    } catch (error: any) {
      logger.error(`Search barbers error: ${error.message}`);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  /**
   * @swagger
   * /api/public/barbers/specialty/{specialty}:
   *   get:
   *     tags: [Public Barber Discovery]
   *     summary: Get barbers by specialty
   *     description: Get all barbers with a specific specialty
   *     parameters:
   *       - in: path
   *         name: specialty
   *         required: true
   *         schema:
   *           type: string
   *         description: Barber specialty
   *         example: "haircut"
   *     responses:
   *       200:
   *         description: Barbers with specialty retrieved
   *       400:
   *         description: Invalid specialty
   */
  getBarbersBySpecialty = async (req: Request, res: Response) => {
    try {
      const { specialty } = req.params;
      const barbers = await this.barberService.getBarbersBySpecialty(specialty);
      
      res.status(200).json({
        success: true,
        data: barbers,
        count: barbers.length
      });
    } catch (error: any) {
      logger.error(`Get barbers by specialty error: ${error.message}`);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  /**
   * @swagger
   * /api/owner/barber/{id}/availability:
   *   put:
   *     tags: [Barber Management]
   *     summary: Update barber availability
   *     description: Update the availability schedule for a barber
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Barber ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - availability
   *             properties:
   *               availability:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     day:
   *                       type: string
   *                     startTime:
   *                       type: string
   *                     endTime:
   *                       type: string
   *                     isAvailable:
   *                       type: boolean
   *     responses:
   *       200:
   *         description: Availability updated successfully
   *       400:
   *         description: Validation error
   *       401:
   *         description: Unauthorized
   */
  updateBarberAvailability = async (req: Request, res: Response) => {
    try {
      const ownerId = req.user?.id;
      const { id } = req.params;
      
      if (!ownerId) {
        return res.status(401).json({ 
          success: false,
          error: "Unauthorized" 
        });
      }

      const updateAvailabilityDto: UpdateAvailabilityDto = req.body;
      const barber = await this.barberService.updateBarberAvailability(id, ownerId, updateAvailabilityDto);
      logger.info(`Barber ${id} availability updated by owner: ${ownerId}`);
      
      res.status(200).json({
        success: true,
        data: barber,
        message: "Barber availability updated successfully"
      });
    } catch (error: any) {
      logger.error(`Update barber availability error: ${error.message}`);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  /**
   * @swagger
   * /api/public/barbers/top-rated:
   *   get:
   *     tags: [Public Barber Discovery]
   *     summary: Get top rated barbers
   *     description: Get barbers sorted by highest rating
   *     parameters:
   *       - in: query
   *         name: limit
   *         schema:
   *           type: number
   *           default: 10
   *         description: Number of barbers to return
   *     responses:
   *       200:
   *         description: Top rated barbers retrieved
   *       500:
   *         description: Server error
   */
  getTopRatedBarbers = async (req: Request, res: Response) => {
    try {
      const { limit } = req.query;
      const limitNum = limit ? parseInt(limit as string) : 10;
      
      const barbers = await this.barberService.getTopRatedBarbers(limitNum);
      
      res.status(200).json({
        success: true,
        data: barbers,
        count: barbers.length
      });
    } catch (error: any) {
      logger.error(`Get top rated barbers error: ${error.message}`);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  getSalonBarberCount = async (req: Request, res: Response) => {
    try {
      const ownerId = req.user?.id;
      if (!ownerId) {
        return res.status(401).json({ 
          success: false,
          error: "Unauthorized" 
        });
      }

      const barberInfo = await this.barberService.getSalonBarberCount(ownerId);
      
      res.status(200).json({
        success: true,
        data: barberInfo
      });
    } catch (error: any) {
      logger.error(`Get salon barber count error: ${error.message}`);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  activateBarber = async (req: Request, res: Response) => {
    try {
      const ownerId = req.user?.id;
      const { id } = req.params;
      
      if (!ownerId) {
        return res.status(401).json({ 
          success: false,
          error: "Unauthorized" 
        });
      }

      const barber = await this.barberService.activateBarber(id, ownerId);
      logger.info(`Barber ${id} activated by owner: ${ownerId}`);
      
      res.status(200).json({
        success: true,
        data: barber,
        message: "Barber activated successfully"
      });
    } catch (error: any) {
      logger.error(`Activate barber error: ${error.message}`);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  deactivateBarber = async (req: Request, res: Response) => {
    try {
      const ownerId = req.user?.id;
      const { id } = req.params;
      
      if (!ownerId) {
        return res.status(401).json({ 
          success: false,
          error: "Unauthorized" 
        });
      }

      const barber = await this.barberService.deactivateBarber(id, ownerId);
      logger.info(`Barber ${id} deactivated by owner: ${ownerId}`);
      
      res.status(200).json({
        success: true,
        data: barber,
        message: "Barber deactivated successfully"
      });
    } catch (error: any) {
      logger.error(`Deactivate barber error: ${error.message}`);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };
}