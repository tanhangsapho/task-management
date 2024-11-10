import { inject, injectable } from "tsyringe";
import { UserRepository } from "../database/repo/user.repo";
import { authConfig } from "../utils/auth.config";
import jwt from "jsonwebtoken";
import {
  IAuthResponse,
  IGoogleProfile,
  IUser,
} from "../database/repo/interface/user.interface";
import { IUserDocument } from "../database/models/user.model";
@injectable()
export class AuthService {
  constructor(
    @inject(UserRepository) private readonly userRepo: UserRepository
  ) {}
  private generateToken(userId: string): string {
    return jwt.sign({ id: userId }, authConfig.jwtSecret, {
      expiresIn: authConfig.jwtExpiration,
    });
  }
  private sanitizeUser(user: IUser): Omit<IUser, "password"> {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }
  async loginWithCredentials(
    email: string,
    password: string
  ): Promise<IAuthResponse> {
    const user = (await this.userRepo.findByEmail(
      email,
      true
    )) as IUserDocument;

    if (!user || !user.password) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    await this.userRepo.updateLastLogin(user.id!);

    return {
      token: this.generateToken(user.id!),
      user: this.sanitizeUser(user),
    };
  }
  async loginWithGoogle(profile: IGoogleProfile): Promise<IAuthResponse> {
    let user = await this.userRepo.findByGoogleId(profile.id);

    if (!user) {
      user = await this.userRepo.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        role: "user",
      });
    }

    await this.userRepo.updateLastLogin(user.id!);

    return {
      token: this.generateToken(user.id!),
      user: this.sanitizeUser(user),
    };
  }
}
