import { CustomerModel } from "../models/Customer";

export class CustomerRepository {
  async findByEmail(email: string) {
    return CustomerModel.findOne({ email });
  }

  async findByResetToken(token: string) {
    return CustomerModel.findOne({ resetPasswordToken: token });
  }

  async create(data: any) {
    return CustomerModel.create(data);
  }
}
