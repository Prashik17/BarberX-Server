import { Barber, BarberModel } from "../models/Barber";
import { SalonModel } from "../models/Salon";
import { Types } from "mongoose";

export class BarberRepository {
  async findById(id: string) {
    return BarberModel.findById(id).populate('salonId', 'salonName address');
  }

  async findBySalonId(salonId: string) {
    return BarberModel.find({ 
      salonId: new Types.ObjectId(salonId), 
      isActive: true 
    }).populate('salonId', 'salonName address');
  }

  async findByOwnerId(ownerId: string) {
    const salon = await SalonModel.findOne({ ownerId: new Types.ObjectId(ownerId) });
    if (!salon) return [];
    
    return BarberModel.find({ 
      salonId: salon._id, 
      isActive: true 
    }).populate('salonId', 'salonName address');
  }

  async create(data: Partial<Barber>) {
    const barber = await BarberModel.create(data);
    // Update salon listing status after adding barber
    await this.updateSalonListingStatus(data.salonId as Types.ObjectId);
    return barber;
  }

  async updateById(id: string, data: Partial<Barber>) {
    return BarberModel.findByIdAndUpdate(
      id, 
      { ...data, updatedAt: new Date() }, 
      { new: true }
    ).populate('salonId', 'salonName address');
  }

  async deleteById(id: string) {
    const barber = await BarberModel.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );
    
    if (barber) {
      // Update salon listing status after removing barber
      await this.updateSalonListingStatus(barber.salonId);
    }
    
    return barber;
  }

  async permanentlyDelete(id: string) {
    const barber = await BarberModel.findById(id);
    if (barber) {
      await BarberModel.findByIdAndDelete(id);
      // Update salon listing status after permanent deletion
      await this.updateSalonListingStatus(barber.salonId);
    }
    return barber;
  }

  async getAllBarbers(filter: any = {}) {
    return BarberModel.find({ 
      ...filter, 
      isActive: true 
    }).populate('salonId', 'salonName address').sort({ createdAt: -1 });
  }

  async searchBarbers(query: string) {
    return BarberModel.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { specialties: { $regex: query, $options: 'i' } },
        { bio: { $regex: query, $options: 'i' } }
      ],
      isActive: true
    }).populate('salonId', 'salonName address');
  }

  async getBarbersBySpecialty(specialty: string) {
    return BarberModel.find({
      specialties: { $regex: specialty, $options: 'i' },
      isActive: true
    }).populate('salonId', 'salonName address');
  }

  async updateAvailability(id: string, availability: any[]) {
    return BarberModel.findByIdAndUpdate(
      id,
      { availability, updatedAt: new Date() },
      { new: true }
    );
  }

  async getTopRatedBarbers(limit: number = 10) {
    return BarberModel.find({ isActive: true })
      .sort({ 'rating.average': -1, 'rating.count': -1 })
      .limit(limit)
      .populate('salonId', 'salonName address');
  }

  async countBarbersBySalonId(salonId: string) {
    return BarberModel.countDocuments({ 
      salonId: new Types.ObjectId(salonId), 
      isActive: true 
    });
  }

  private async updateSalonListingStatus(salonId: Types.ObjectId) {
    const salon = await SalonModel.findById(salonId);
    if (salon && salon.updateListingStatus) {
      await salon.updateListingStatus();
    }
  }

  async activateBarber(id: string) {
    const barber = await BarberModel.findByIdAndUpdate(
      id,
      { isActive: true, updatedAt: new Date() },
      { new: true }
    );
    
    if (barber) {
      await this.updateSalonListingStatus(barber.salonId);
    }
    
    return barber;
  }

  async deactivateBarber(id: string) {
    const barber = await BarberModel.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );
    
    if (barber) {
      await this.updateSalonListingStatus(barber.salonId);
    }
    
    return barber;
  }
}