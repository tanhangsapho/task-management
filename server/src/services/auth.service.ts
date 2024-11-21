import { inject, injectable } from "tsyringe";
import { UserRepository } from "../database/repo/user.repo";
import { authConfig } from "../utils/auth.config";
import jwt from "jsonwebtoken";
import {
  IGithubProfile,
  IGoogleProfile,
  ITokens,
  IUser,
} from "../database/repo/interface/user.interface";
import { TokenRepository } from "../database/repo/token.repo";

@injectable()
export class AuthService {
  constructor(
    @inject(UserRepository)
    private readonly userRepo: UserRepository,
    @inject(TokenRepository) private readonly tokenRepo: TokenRepository
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
  async loginWithGithub(profile: IGithubProfile): Promise<ITokens> {
    try {
      if (!profile.emails || profile.emails.length === 0) {
        console.log("Profile has no emails:", profile);
        throw new Error("GitHub account does not have a public email address.");
      }

      const email = profile.emails[0].value;

      let user = await this.userRepo.findByGithubId(profile.id);
      console.log(user);

      if (!user) {
        user = await this.userRepo.create({
          githubId: profile.id,
          email: email,
          name: profile.username || "GitHub User",
          photos:
            profile.photos && profile.photos[0] ? profile.photos[0].value : "",
          isVerified: true,
          role: "user",
          lastLogin: new Date(),
        });
      }
      await this.userRepo.updateLastLogin(user.userId!);
      this.sanitizeUser(user);
      return this.generateAuthTokens(user.userId!.toString(), user.role);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getCurrentUser(userId: string): Promise<IUser | null> {
    try {
      const user = await this.userRepo.getCurrentUser(userId);
      if (user) {
        await this.userRepo.updateLastLogin(userId);
      }
      return user;
    } catch (error) {
      console.error("Error in getCurrentUser service:", error);
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<ITokens> {
    const refreshTokenDoc = await this.tokenRepo.findRefreshToken(refreshToken);
    if (!refreshTokenDoc) {
      throw new Error("Invalid refresh token");
    }
    const user = await this.userRepo.getCurrentUser(
      refreshTokenDoc.userId?.toString()
    );
    if (!user) {
      throw new Error("User not found");
    }
    await this.tokenRepo.blacklistRefreshToken(refreshToken);
    return this.generateAuthTokens(user.userId!, user.role);
  }
  async logout(refreshToken: string): Promise<void> {
    await this.tokenRepo.blacklistRefreshToken(refreshToken);
  }

  async loginWithGoogle(profile: IGoogleProfile): Promise<ITokens> {
    let user = await this.userRepo.findByGoogleId(profile.id);

    if (!user) {
      user = await this.userRepo.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        photos:
          profile.photos && profile.photos[0] ? profile.photos[0].value : "",
        isVerified: true,
        role: "user",
        lastLogin: new Date(),
      });
    }

    await this.userRepo.updateLastLogin(user.userId!);
    this.sanitizeUser(user);
    return this.generateAuthTokens(user.userId!, user.role);
  }
  // async register(userData: IRegisterDTO): Promise<ITokens> {
  //   try {
  //     const validatedData = registerSchema.parse(userData);

  //     const existingUser = await this.userRepo.findByEmail(validatedData.email);
  //     if (existingUser) {
  //       throw new Error("Email already registered");
  //     }
  //     const hashedPassword = await bcrypt.hash(validatedData.password, 12);
  //     const user = await this.userRepo.create({
  //       ...validatedData,
  //       password: hashedPassword,
  //       role: "user",
  //       isVerified: false,
  //     });

  //     const verificationToken = await this.verificationRepo.createToken(
  //       user.userId.toString()!
  //     );
  //     await this.emailService.sendVerificationEmail(
  //       user.email,
  //       verificationToken.token
  //     );

  //     return this.generateAuthTokens(user.userId.toString()!, user.role);
  //   } catch (error) {
  //     console.error("Registration error:", error);
  //     throw error;
  //   }
  // }

  // async verifyEmail(token: string): Promise<ITokens> {
  //   console.log("Verifying token:", token);

  //   const verificationToken = await this.verificationRepo.findByToken(token);
  //   console.log("Found verification token:", verificationToken);

  //   if (!verificationToken) {
  //     throw new Error("Invalid verification token");
  //   }
  //   console.log("Updating user:", verificationToken.userId.toString());

  //   await this.userRepo.updateById(verificationToken.userId.toString(), {
  //     isVerified: true,
  //   });

  //   const user = await this.userRepo.findUserById(
  //     verificationToken.userId.toString()
  //   );
  //   console.log("Found user:", user);

  //   if (!user) {
  //     throw new Error("User not found");
  //   }
  //   console.log("Deleting token");

  //   await this.verificationRepo.deleteToken(token);
  //   return this.generateAuthTokens(user.userId.toString()!, user.role);
  // }

  // async loginWithCredentials(
  //   email: string,
  //   password: string
  // ): Promise<ITokens> {
  //   try {
  //     // Find user and explicitly select password
  //     const user = await this.userRepo.findByEmail(email, true);

  //     console.log("Login attempt debug:", {
  //       userFound: !!user,
  //       hasPassword: user?.password ? "Yes" : "No",
  //       isVerified: user?.isVerified,
  //     });

  //     if (!user || !(user instanceof User)) {
  //       throw new Error("Invalid credentials");
  //     }

  //     if (!user.isVerified) {
  //       throw new Error("Please verify your email before logging in");
  //     }

  //     // Ensure password exists in the retrieved user document
  //     if (!user.password) {
  //       console.error("User found but password field is missing");
  //       throw new Error("Invalid credentials");
  //     }

  //     const isPasswordValid = await user.comparePassword(password);

  //     if (!isPasswordValid) {
  //       console.log("Password validation failed for user:", email);
  //       throw new Error("Invalid credentials");
  //     }

  //     await this.userRepo.updateLastLogin(user.id!);
  //     return this.generateAuthTokens(user.id!, user.role);
  //   } catch (error) {
  //     console.error("Login error:", error);
  //     throw error;
  //   }
  // }
}
