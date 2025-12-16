import { BarberRepository } from "../repositories/BarberRepository";
import { SalonRepository } from "../repositories/SalonRepository";
import { CreateBarberDto, UpdateBarberDto, UpdateAvailabilityDto } from "../dtos/barber.dto";

export class BarberService {
  private barberRepository = new BarberRepository();
  private salonRepository = new SalonRepository();

  async createBarber(ownerId: string, barberData: CreateBarberDto) {
    // First, find the salon owned by this owner
    const salon = await this.salonRepository.findByOwnerId(ownerId);
    if (!salon) {
      throw new Error("Salon not found for this owner");
    }

    const barber = await this.barberRepository.create({
      ...barberData,
      salonId: salon._id
    });

    return barber;
  }

  async getBarberById(id: string) {
    const barber = await this.barberRepository.findById(id);
    if (!barber) {
      throw new Error("Barber not found");
    }
    return barber;
  }

  async getBarbersBySalonId(salonId: string) {
    return this.barberRepository.findBySalonId(salonId);
  }

  async getBarbersByOwnerId(ownerId: string) {
    return this.barberRepository.findByOwnerId(ownerId);
  }

  async updateBarber(id: string, ownerId: string, updateData: UpdateBarberDto) {
    // Verify the barber belongs to this owner's salon
    const salon = await this.salonRepository.findByOwnerId(ownerId);
    if (!salon) {
      throw new Error("Salon not found for this owner");
    }

    const barber = await this.barberRepository.findById(id);
    if (!barber || !barber.salonId.equals(salon._id)) {
      throw new Error("Barber not found or doesn't belong to your salon");
    }

    const updatedBarber = await this.barberRepository.updateById(id, updateData);
    if (!updatedBarber) {
      throw new Error("Failed to update barber");
    }

    return updatedBarber;
  }

  async deleteBarber(id: string, ownerId: string) {
    // Verify the barber belongs to this owner's salon
    const salon = await this.salonRepository.findByOwnerId(ownerId);
    if (!salon) {
      throw new Error("Salon not found for this owner");
    }

    const barber = await this.barberRepository.findById(id);
    if (!barber || !barber.salonId.equals(salon._id)) {
      throw new Error("Barber not found or doesn't belong to your salon");
    }

    const deletedBarber = await this.barberRepository.deleteById(id);
    if (!deletedBarber) {
      throw new Error("Failed to delete barber");
    }

    return { message: "Barber deleted successfully" };
  }

  async getAllBarbers(filter: any = {}) {
    return this.barberRepository.getAllBarbers(filter);
  }

  async searchBarbers(query: string) {
    if (!query || query.trim().length < 2) {
      throw new Error("Search query must be at least 2 characters long");
    }
    return this.barberRepository.searchBarbers(query.trim());
  }

  async getBarbersBySpecialty(specialty: string) {
    if (!specialty || specialty.trim().length < 2) {
      throw new Error("Specialty must be at least 2 characters long");
    }
    return this.barberRepository.getBarbersBySpecialty(specialty.trim());
  }

  async updateBarberAvailability(id: string, ownerId: string, availabilityData: UpdateAvailabilityDto) {
    // Verify the barber belongs to this owner's salon
    const salon = await this.salonRepository.findByOwnerId(ownerId);
    if (!salon) {
      throw new Error("Salon not found for this owner");
    }

    const barber = await this.barberRepository.findById(id);
    if (!barber || !barber.salonId.equals(salon._id)) {
      throw new Error("Barber not found or doesn't belong to your salon");
    }

    const updatedBarber = await this.barberRepository.updateAvailability(id, availabilityData.availability);
    if (!updatedBarber) {
      throw new Error("Failed to update barber availability");
    }

    return updatedBarber;
  }

  async getTopRatedBarbers(limit: number = 10) {
    return this.barberRepository.getTopRatedBarbers(limit);
  }

  async getSalonBarberCount(ownerId: string) {
    const salon = await this.salonRepository.findByOwnerId(ownerId);
    if (!salon) {
      throw new Error("Salon not found for this owner");
    }

    const count = await this.barberRepository.countBarbersBySalonId(salon._id.toString());
    const listingStatus = count > 0 ? "listed" : "notListed";

    return {
      salonId: salon._id,
      salonName: salon.salonName,
      barberCount: count,
      listingStatus: listingStatus
    };
  }

  async activateBarber(id: string, ownerId: string) {
    // Verify the barber belongs to this owner's salon
    const salon = await this.salonRepository.findByOwnerId(ownerId);
    if (!salon) {
      throw new Error("Salon not found for this owner");
    }

    const barber = await this.barberRepository.findById(id);
    if (!barber || !barber.salonId.equals(salon._id)) {
      throw new Error("Barber not found or doesn't belong to your salon");
    }

    const activatedBarber = await this.barberRepository.activateBarber(id);
    if (!activatedBarber) {
      throw new Error("Failed to activate barber");
    }

    return activatedBarber;
  }

  async deactivateBarber(id: string, ownerId: string) {
    // Verify the barber belongs to this owner's salon
    const salon = await this.salonRepository.findByOwnerId(ownerId);
    if (!salon) {
      throw new Error("Salon not found for this owner");
    }

    const barber = await this.barberRepository.findById(id);
    if (!barber || !barber.salonId.equals(salon._id)) {
      throw new Error("Barber not found or doesn't belong to your salon");
    }

    const deactivatedBarber = await this.barberRepository.deactivateBarber(id);
    if (!deactivatedBarber) {
      throw new Error("Failed to deactivate barber");
    }

    return deactivatedBarber;
  }
}