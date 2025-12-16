import type { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

const authService = new AuthService();

export class AuthController {
  /**
   * @swagger
   * /api/auth/signup/customer:
   *   post:
   *     tags: [Authentication]
   *     summary: Register a new customer
   *     description: Create a new customer account
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - email
   *               - password
   *             properties:
   *               name:
   *                 type: string
   *                 example: "John Doe"
   *               email:
   *                 type: string
   *                 format: email
   *                 example: "customer@example.com"
   *               password:
   *                 type: string
   *                 minLength: 6
   *                 example: "SecurePass123"
   *     responses:
   *       200:
   *         description: Customer registered successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 token:
   *                   type: string
   *       400:
   *         description: Registration failed
   */
  async registerCustomer(req: Request, res: Response) {
    try {
      const result = await authService.register(req.body, "customer");
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  /**
   * @swagger
   * /api/auth/signup/owner:
   *   post:
   *     tags: [Authentication]
   *     summary: Register a new salon owner
   *     description: Create a new salon owner account
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - email
   *               - password
   *             properties:
   *               name:
   *                 type: string
   *                 example: "Jane Smith"
   *               email:
   *                 type: string
   *                 format: email
   *                 example: "owner@example.com"
   *               password:
   *                 type: string
   *                 minLength: 6
   *                 example: "SecurePass123"
   *     responses:
   *       200:
   *         description: Owner registered successfully
   *       400:
   *         description: Registration failed
   */
  async registerOwner(req: Request, res: Response) {
    try {
      const result = await authService.register(req.body, "owner");
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     tags: [Authentication]
   *     summary: Login user (customer or owner)
   *     description: Authenticate user and return JWT token
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: "user@example.com"
   *               password:
   *                 type: string
   *                 example: "SecurePass123"
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 token:
   *                   type: string
   *                 user:
   *                   type: object
   *       400:
   *         description: Invalid credentials
   */
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  /**
   * @swagger
   * /api/auth/forgot-password:
   *   post:
   *     tags: [Authentication]
   *     summary: Request password reset
   *     description: Send password reset token to user's email
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: "user@example.com"
   *     responses:
   *       200:
   *         description: Password reset email sent
   *       400:
   *         description: Email not found
   */
  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  /**
   * @swagger
   * /api/auth/reset-password:
   *   post:
   *     tags: [Authentication]
   *     summary: Reset password with token
   *     description: Reset user password using reset token
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - token
   *               - newPassword
   *             properties:
   *               token:
   *                 type: string
   *                 example: "reset_token_here"
   *               newPassword:
   *                 type: string
   *                 minLength: 6
   *                 example: "NewSecurePass123"
   *     responses:
   *       200:
   *         description: Password reset successful
   *       400:
   *         description: Invalid or expired token
   */
  async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;
      const result = await authService.resetPassword(token, newPassword);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}


export default new AuthController()