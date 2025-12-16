import { Owner, OwnerModel } from "../models/Owner";

export class OwnerRepository {
  async findByEmail(email: string) {
    return OwnerModel.findOne({ email });
  }

  async findByResetToken(token: string) {
    return OwnerModel.findOne({ resetPasswordToken: token });
  }

  async create(data: any) {
    return OwnerModel.create(data);
  }
  
  async updateById(id: string, data: Partial<Owner>) {
    return OwnerModel.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async deleteById(id: string) {
    return OwnerModel.findByIdAndDelete(id);
  }
  
}
