import { SalonRepository } from "../repositories/SalonRepository";
import { Salon } from "../models/Salon";
import { CreateSalonDto, UpdateSalonDto, AddServiceDto, UpdateServiceDto, AddBarberDto, RemoveBarberDto, UpdateBarbersDto } from "../dtos/salon.dto";

export class SalonService {
  private salonRepository = new SalonRepository();

  async createSalon(ownerId: string, salonData: CreateSalonDto) {
    const existingSalon = await this.salonRepository.findByOwnerId(ownerId);
    if (existingSalon) {
      throw new Error("Owner already has a salon profile");
    }

    const salon = await this.salonRepository.create({
      ...salonData,
      ownerId
    });

    return salon;
  }

  async getSalonByOwnerId(ownerId: string) {
    const salon = await this.salonRepository.findByOwnerId(ownerId);
    if (!salon) {
      throw new Error("Salon not found");
    }
    return salon;
  }

  async getSalonById(id: string) {
    const salon = await this.salonRepository.findById(id);
    if (!salon) {
      throw new Error("Salon not found");
    }
    return salon;
  }

  async updateSalon(ownerId: string, updateData: UpdateSalonDto) {
    const salon = await this.salonRepository.updateByOwnerId(ownerId, updateData);
    if (!salon) {
      throw new Error("Salon not found or update failed");
    }
    return salon;
  }

  async updateSalonById(id: string, updateData: UpdateSalonDto) {
    const salon = await this.salonRepository.updateById(id, updateData);
    if (!salon) {
      throw new Error("Salon not found or update failed");
    }
    return salon;
  }

  async deleteSalon(ownerId: string) {
    const salon = await this.salonRepository.deleteByOwnerId(ownerId);
    if (!salon) {
      throw new Error("Salon not found");
    }
    return { message: "Salon deleted successfully" };
  }

  async getAllSalons(filter: any = {}) {
    return this.salonRepository.getAllSalons(filter);
  }

  async getApprovedSalons() {
    return this.salonRepository.getApprovedSalons();
  }

  async getListedSalons() {
    return this.salonRepository.getListedSalons();
  }

  async getAllListedSalons() {
    return this.salonRepository.getAllListedSalons();
  }

  async searchSalons(query: string) {
    if (!query || query.trim().length < 2) {
      throw new Error("Search query must be at least 2 characters long");
    }
    return this.salonRepository.searchSalons(query.trim());
  }

  async getSalonsByLocation(latitude: number, longitude: number, maxDistance: number = 5000) {
    if (!latitude || !longitude) {
      throw new Error("Latitude and longitude are required");
    }
    return this.salonRepository.getSalonsByLocation([longitude, latitude], maxDistance);
  }

  async updateSalonStatus(id: string, status: "pending" | "approved" | "rejected") {
    const salon = await this.salonRepository.updateSalonStatus(id, status);
    if (!salon) {
      throw new Error("Salon not found");
    }
    return salon;
  }

  async addService(ownerId: string, service: AddServiceDto) {
    const salon = await this.salonRepository.findByOwnerId(ownerId);
    if (!salon) {
      throw new Error("Salon not found");
    }

    salon.services.push(service);
    await salon.save();
    return salon;
  }

  async updateService(ownerId: string, serviceIndex: number, service: UpdateServiceDto) {
    const salon = await this.salonRepository.findByOwnerId(ownerId);
    if (!salon) {
      throw new Error("Salon not found");
    }

    if (serviceIndex < 0 || serviceIndex >= salon.services.length) {
      throw new Error("Service not found");
    }

    Object.assign(salon.services[serviceIndex], service);
    await salon.save();
    return salon;
  }

  async removeService(ownerId: string, serviceIndex: number) {
    const salon = await this.salonRepository.findByOwnerId(ownerId);
    if (!salon) {
      throw new Error("Salon not found");
    }

    if (serviceIndex < 0 || serviceIndex >= salon.services.length) {
      throw new Error("Service not found");
    }

    salon.services.splice(serviceIndex, 1);
    await salon.save();
    return salon;
  }

}