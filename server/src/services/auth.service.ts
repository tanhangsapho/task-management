import { inject, injectable } from "tsyringe";
import { UserRepository } from "../database/repo/user.repo";
import { authConfig } from "../utils/auth.config";
import jwt from "jsonwebtoken";
import {
  IAuthResponse,
  IGoogleProfile,
  IRegisterDTO,
  ITokens,
  IUser,
} from "../database/repo/interface/user.interface";
import { IUserDocument, User } from "../database/models/user.model";
import { VerificationRepository } from "../database/repo/verification.repo";
import { TokenRepository } from "../database/repo/token.repo";
import { EmailService } from "./email.service";
import { registerSchema } from "../schemas/auth.schema";
import bcrypt from "bcrypt";
import { use } from "passport";
@injectable()
export class AuthService {
  constructor(
    @inject(UserRepository)
    private readonly userRepo: UserRepository,
    @inject(VerificationRepository)
    private readonly verificationRepo: VerificationRepository,
    @inject(TokenRepository) private readonly tokenRepo: TokenRepository,
    @inject(EmailService) private readonly emailService: EmailService
  ) {}
  private generateToken(userId: string, role: string): string {
    return jwt.sign({ id: userId, role }, authConfig.jwtSecret, {
      expiresIn: authConfig.jwtExpiration,
    });
  }
  private sanitizeUser(user: IUser): Omit<IUser, "password"> {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }
  async generateAuthTokens(userId: string, role: string): Promise<ITokens> {
    const accessToken = this.generateToken(userId, role);
    const refreshTokenDoc = await this.tokenRepo.createRefreshToken(userId);

    return {
      accessToken,
      refreshToken: refreshTokenDoc.token,
    };
  }

  async register(userData: IRegisterDTO): Promise<ITokens> {
    const validatedData = registerSchema.parse(userData);
    console.log("Input password:", userData.password); // Input password from the login function
    const existingUser = await this.userRepo.findByEmail(validatedData.email);
    if (existingUser) {
      throw new Error("Email already registered");
    }
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    const user = await this.userRepo.create({
      ...validatedData,
      password: hashedPassword,
      role: "user",
      isVerified: false,
    });
    const verificationToken = await this.verificationRepo.createToken(user.id!);
    await this.emailService.sendVerificationEmail(
      user.email,
      verificationToken.token
    );
    return this.generateAuthTokens(user.id!, user.role);
  }

  async verifyEmail(token: string): Promise<ITokens> {
    console.log("Verifying token:", token);

    const verificationToken = await this.verificationRepo.findByToken(token);
    console.log("Found verification token:", verificationToken);

    if (!verificationToken) {
      throw new Error("Invalid verification token");
    }
    console.log("Updating user:", verificationToken.userId.toString());

    await this.userRepo.updateById(verificationToken.userId.toString(), {
      isVerified: true,
    });

    const user = await this.userRepo.findUserById(
      verificationToken.userId.toString()
    );
    console.log("Found user:", user);

    if (!user) {
      throw new Error("User not found");
    }
    console.log("Deleting token");

    await this.verificationRepo.deleteToken(token);
    return this.generateAuthTokens(user.id!, user.role);
  }

  async loginWithCredentials(
    email: string,
    password: string
  ): Promise<ITokens> {
    const user = await this.userRepo.findByEmail(email, true);
    if (!(user instanceof User)) {
      throw new Error("Invalid user"); // Ensure user is a Mongoose model
    }

    console.log("Input password:", password); // Log input password
    console.log("Stored password hash:", user.password); // Log stored hash password
    console.log("Found user:", user);

    if (!user) {
      console.log("No user found for email:", email);
      throw new Error("Invalid credentials");
    }

    if (!user.isVerified) {
      console.log("User not verified");
      throw new Error("Please verify your email before logging in");
    }

    if (!user.password) {
      console.log("User found but has no password (might be Google account)");
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.comparePassword(password.trim());
    if (!isPasswordValid) {
      console.log("Password validation failed");
      throw new Error("Invalid credentials");
    }

    await this.userRepo.updateLastLogin(user.id!);

    return this.generateAuthTokens(user.id!, user.role);
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
      token: this.generateToken(user.id!, user.role),
      user: this.sanitizeUser(user),
    };
  }
  async refreshToken(refreshToken: string): Promise<ITokens> {
    const refreshTokenDoc = await this.tokenRepo.findRefreshToken(refreshToken);
    if (!refreshTokenDoc) {
      throw new Error("Invalid refresh token");
    }
    const user = await this.userRepo.findUserById(
      refreshTokenDoc.userId.toString()
    );
    if (!user) {
      throw new Error("User not found");
    }
    await this.tokenRepo.blacklistRefreshToken(refreshToken);
    return this.generateAuthTokens(user.id!, user.role);
  }
  async logout(refreshToken: string): Promise<void> {
    await this.tokenRepo.blacklistRefreshToken(refreshToken);
  }
}
