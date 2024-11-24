import { inject, injectable } from "tsyringe";
import { AuthService } from "../services/auth.service";
import { Request, Response } from "express";
@injectable()
export class ProfileController {
  constructor(@inject(AuthService) private readonly authService: AuthService) {}

  async getUserProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: "User not authenticated" });
        return;
      }

      const userId = req.user.userId; // Assuming `req.user.id` is set by your middleware
      if (!userId) {
        throw Error("User Not Found");
      }
      const userProfile = await this.authService.getCurrentUser(userId); // Fetch user profile if needed

      res.json({
        message: "User authenticated",
        userId,
        profile: userProfile || req.user, // Use the user profile from the service or the request
      });
    } catch (error) {
      console.error("Error in getUserProfile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
