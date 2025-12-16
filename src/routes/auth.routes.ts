import express from "express";
const { Router } = express;
import authController from "../controllers/AuthController"

const router = Router();



router.post("/signup/customer", authController.registerCustomer);
router.post("/signup/owner", authController.registerOwner);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
export default router;