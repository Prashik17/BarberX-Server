import { Router } from "express";
import { BarberController } from "../controllers/BarberController";
import { 
  validateCreateBarber, 
  validateUpdateBarber, 
  validateAvailability
} from "../middlewares/validation.middleware";

const router = Router();
const barberController = new BarberController();

// Owner-specific barber routes (requires owner auth)
router.post("/", validateCreateBarber, barberController.createBarber);
router.get("/my-barbers", barberController.getMyBarbers);
router.get("/barber-count", barberController.getSalonBarberCount);
router.put("/:id", validateUpdateBarber, barberController.updateBarber);
router.delete("/:id", barberController.deleteBarber);
router.put("/:id/availability", validateAvailability, barberController.updateBarberAvailability);
router.put("/:id/activate", barberController.activateBarber);
router.put("/:id/deactivate", barberController.deactivateBarber);

// Get specific barber (for owner verification)
router.get("/:id", barberController.getBarberById);

export default router;