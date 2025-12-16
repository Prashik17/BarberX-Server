import { Router } from "express";
import { SalonController } from "../controllers/SalonController";
import { BarberController } from "../controllers/BarberController";

const router = Router();
const salonController = new SalonController();
const barberController = new BarberController();

/**
 * @swagger
 * /api/public/health:
 *   get:
 *     tags: [System]
 *     summary: Health check
 *     description: Check if the API server is running and database is connected
 *     responses:
 *       200:
 *         description: API server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "ok"
 *                 db:
 *                   type: string
 *                   example: "connected"
 */
router.get("/health", (req, res) => {
    res.json({status: "ok", db: "connected"});
});

/**
 * @swagger
 * /api/public/salons:
 *   get:
 *     tags: [Public Salon Discovery]
 *     summary: Get listed salons
 *     description: Get all publicly listed and approved salons
 *     responses:
 *       200:
 *         description: Listed salons retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 count:
 *                   type: number
 *       500:
 *         description: Server error
 */
router.get("/salons", salonController.getListedSalons);

// Public barber discovery routes
router.get("/barbers", barberController.getAllBarbers);
router.get("/barbers/search", barberController.searchBarbers);
router.get("/barbers/specialty/:specialty", barberController.getBarbersBySpecialty);
router.get("/barbers/top-rated", barberController.getTopRatedBarbers);
router.get("/barbers/salon/:salonId", barberController.getBarbersBySalon);
router.get("/barbers/:id", barberController.getBarberById);

export default router;