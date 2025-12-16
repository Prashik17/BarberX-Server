import { Router } from "express";
import { CustomerProfileController } from "../controllers/CustomerProfileController";
import { 
  validateCreateCustomerProfile, 
  validateUpdateCustomerProfile, 
  validateAddBooking,
  validateNotificationPreferences,
  validateFavoriteService,
  validateLoyaltyPoints,
  validateCustomerSearchParams
} from "../middlewares/validation.middleware";

const router = Router();
const customerProfileController = new CustomerProfileController();

router.post("/", validateCreateCustomerProfile, customerProfileController.createProfile);
router.get("/my-profile", customerProfileController.getMyProfile);
router.put("/my-profile", validateUpdateCustomerProfile, customerProfileController.updateMyProfile);
router.delete("/my-profile", customerProfileController.deleteMyProfile);

router.get("/all", customerProfileController.getAllProfiles);
router.get("/active", customerProfileController.getActiveProfiles);
router.get("/search", customerProfileController.searchProfiles);
router.get("/membership/:tier", customerProfileController.getProfilesByMembershipTier);
router.get("/top-loyalty", customerProfileController.getTopLoyaltyCustomers);
router.get("/:id", customerProfileController.getProfileById);

router.put("/:customerId/loyalty-points", validateLoyaltyPoints, customerProfileController.updateLoyaltyPoints);

router.post("/booking-history", validateAddBooking, customerProfileController.addBookingHistory);

router.post("/preferred-salons/:salonId", customerProfileController.addPreferredSalon);
router.delete("/preferred-salons/:salonId", customerProfileController.removePreferredSalon);

router.put("/notification-preferences", validateNotificationPreferences, customerProfileController.updateNotificationPreferences);

router.post("/favorite-services", validateFavoriteService, customerProfileController.addFavoriteService);
router.delete("/favorite-services/:serviceName", customerProfileController.removeFavoriteService);

router.put("/deactivate", customerProfileController.deactivateProfile);
router.put("/reactivate", customerProfileController.reactivateProfile);

export default router;