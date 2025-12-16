import { CustomerRepository } from "../repositories/CustomerRepository";
import { OwnerRepository } from "../repositories/OwnerRepository";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";
import crypto from "crypto";

export class AuthService {
  private customerRepo = new CustomerRepository();
  private ownerRepo = new OwnerRepository();

  async register(data: any, role: "customer" | "owner") {
    const repo = role === "customer" ? this.customerRepo : this.ownerRepo;

    const hashedPassword = await hashPassword(data.password);
    const user = await repo.create({ ...data, password: hashedPassword, role });

    const message = role === "customer" ? "Customer registered successfully" : "Owner registered successfully";
    return { message };
  }

  async login(email: string, password: string) {
    const user =
      (await this.customerRepo.findByEmail(email)) ||
      (await this.ownerRepo.findByEmail(email));

    if (!user) throw new Error("Invalid credentials!");

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = generateToken(user.id, user.role);

    return {
      token,
      role: user.role,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.name
      }
    };
  }

  async forgotPassword(email: string) {
    const user =
      (await this.customerRepo.findByEmail(email)) ||
      (await this.ownerRepo.findByEmail(email));

    if (!user) throw new Error("User not found");

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // Normally, send resetToken via email
    return { message: "Reset link generated", resetToken };
  }

  async resetPassword(token: string, newPassword: string) {
    const user =
      (await this.customerRepo.findByResetToken(token)) ||
      (await this.ownerRepo.findByResetToken(token));

    if (!user) throw new Error("Invalid or expired token");
    if (user.resetPasswordExpires && user.resetPasswordExpires < new Date())
      throw new Error("Token expired");

    user.password = await hashPassword(newPassword);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return { message: "Password reset successful" };
  }
}
