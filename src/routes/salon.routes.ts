import { Router } from "express";
import { SalonController } from "../controllers/SalonController";
import { 
  validateCreateSalon, 
  validateUpdateSalon, 
  validateService,
  validateStatusUpdate,
  validateSearchParams
} from "../middlewares/validation.middleware";

const router = Router();
const salonController = new SalonController();

router.post("/", validateCreateSalon, salonController.createSalon);
router.get("/my-salon", salonController.getMySalon);
router.put("/my-salon", validateUpdateSalon, salonController.updateMySalon);
router.delete("/my-salon", salonController.deleteMySalon);

router.get("/all", salonController.getAllSalons);
router.get("/approved", salonController.getApprovedSalons);
router.get("/listed", salonController.getListedSalons);
router.get("/all-listed", salonController.getAllListedSalons);
router.get("/search", salonController.searchSalons);
router.get("/nearby", validateSearchParams, salonController.getSalonsByLocation);
router.get("/:id", salonController.getSalonById);

router.put("/:id/status", validateStatusUpdate, salonController.updateSalonStatus);

router.post("/services", validateService, salonController.addService);
router.put("/services/:serviceIndex", validateService, salonController.updateService);
router.delete("/services/:serviceIndex", salonController.removeService);

export default router;