import { Salon, SalonModel } from "../models/Salon";
import { Types } from "mongoose";

export class SalonRepository {
  async findByOwnerId(ownerId: string) {
    return SalonModel.findOne({ ownerId: new Types.ObjectId(ownerId) }).populate('ownerId', 'name email');
  }

  async findById(id: string) {
    return SalonModel.findById(id).populate('ownerId', 'name email');
  }

  async create(data: Partial<Salon>) {
    return SalonModel.create(data);
  }

  async updateById(id: string, data: Partial<Salon>) {
    return SalonModel.findByIdAndUpdate(id, { ...data, updatedAt: new Date() }, { new: true }).lean();
  }

  async updateByOwnerId(ownerId: string, data: Partial<Salon>) {
    return SalonModel.findOneAndUpdate(
      { ownerId: new Types.ObjectId(ownerId) }, 
      { ...data, updatedAt: new Date() }, 
      { new: true }
    ).lean();
  }

  async deleteById(id: string) {
    return SalonModel.findByIdAndDelete(id);
  }

  async deleteByOwnerId(ownerId: string) {
    return SalonModel.findOneAndDelete({ ownerId: new Types.ObjectId(ownerId) });
  }

  async getAllSalons(filter: any = {}) {
    return SalonModel.find(filter).populate('ownerId', 'name email').sort({ createdAt: -1 });
  }

  async getApprovedSalons() {
    return SalonModel.find({ status: "approved" }).populate('ownerId', 'name email').sort({ createdAt: -1 });
  }

  async getListedSalons() {
    return SalonModel.find({ 
      status: "approved", 
      listingStatus: "listed" 
    }).populate('ownerId', 'name email').sort({ createdAt: -1 });
  }

  async getAllListedSalons() {
    return SalonModel.find({ 
      listingStatus: "listed" 
    }).populate('ownerId', 'name email').sort({ createdAt: -1 });
  }

  async searchSalons(query: string) {
    return SalonModel.find({
      $or: [
        { salonName: { $regex: query, $options: 'i' } },
        { address: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ],
      status: "approved",
      listingStatus: "listed"
    }).populate('ownerId', 'name email');
  }

  async getSalonsByLocation(coordinates: [number, number], maxDistance: number = 5000) {
    return SalonModel.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: coordinates
          },
          $maxDistance: maxDistance
        }
      },
      status: "approved",
      listingStatus: "listed"
    }).populate('ownerId', 'name email');
  }

  async updateSalonStatus(id: string, status: "pending" | "approved" | "rejected") {
    return SalonModel.findByIdAndUpdate(
      id, 
      { status, updatedAt: new Date() }, 
      { new: true }
    );
  }

}