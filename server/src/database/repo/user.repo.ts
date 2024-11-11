import { injectable } from "tsyringe";
import { IUser } from "./interface/user.interface";
import { User } from "../models/user.model";

@injectable()
export class UserRepository {
  async findByEmail(
    email: string,
    includePassword: boolean = false
  ): Promise<IUser | null> {
    const query = User.findOne({ email });
    if (includePassword) query.select("+password");
    return query.exec();
  }
  async findByGoogleId(googleId: string): Promise<IUser | null> {
    return User.findOne({ googleId }).exec();
  }
  async create(userData: Partial<IUser>): Promise<IUser> {
    return User.create(userData);
  }
  async updateLastLogin(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, {
      lastLogin: new Date(),
    });
  }
  async findUserById(id: string): Promise<IUser | null> {
    return User.findById(id).exec();
  }
  async updateById(
    id: string,
    updateData: Partial<IUser>
  ): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, updateData, { new: true });
  }
}
