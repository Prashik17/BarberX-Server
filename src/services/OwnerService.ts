import { OwnerRepository } from "../repositories/OwnerRepository";

export class OwnerService {
  private ownerRepo = new OwnerRepository();
  
  // Owner-specific business logic methods can be added here as needed
  // Authentication and registration are handled by AuthService
}
