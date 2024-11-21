import { injectable } from "tsyringe";
import { IUser } from "./interface/user.interface";
import { IUserDocument, User } from "../models/user.model";

@injectable()
export class UserRepository {
  async findByEmail(
    email: string,
    includePassword: boolean = false
  ): Promise<IUserDocument | null> {
    try {
      const query = User.findOne({ email: email.toLowerCase().trim() });

      if (includePassword) {
        query.select("+password");
      }

      const user = await query.exec();

      console.log("Repository findByEmail debug:", {
        email,
        userFound: !!user,
        hasPassword: user?.password ? "Yes" : "No",
        includePasswordParam: includePassword,
      });

      return user;
    } catch (error) {
      console.error("Error in findByEmail:", error);
      throw error;
    }
  }
  async findByGoogleId(googleId: string): Promise<IUser | null> {
    return User.findOne({ googleId }).exec();
  }
  async findByGithubId(githubId: string): Promise<IUser | null> {
    return User.findOne({ githubId }).exec();
  }
  async update(
    id: string,
    data: Partial<{
      picture: string;
    }>
  ): Promise<IUserDocument | null> {
    const user = await User.findByIdAndUpdate(id, data, {
      new: true,
    });
    return user;
  }
  async create(userData: Partial<IUser>): Promise<IUserDocument> {
    return User.create(userData);
  }
  async updateLastLogin(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, {
      lastLogin: new Date(),
    });
  }
  async getCurrentUser(id: string): Promise<IUserDocument | null> {
    return User.findById(id).exec(); // Use findById for querying `_id`
  }
  async updateById(
    id: string,
    updateData: Partial<IUserDocument>
  ): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, updateData, { new: true });
  }
}
