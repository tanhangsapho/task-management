import { inject, injectable } from "tsyringe";
import { AuthService } from "../services/auth.service";
import e, { Request, Response } from "express";
import { IGoogleProfile } from "../database/repo/interface/user.interface";

@injectable()
export class AuthController {
  constructor(@inject(AuthService) private readonly authService: AuthService) {}
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const authResponse = await this.authService.loginWithCredentials(
        email,
        password
      );
      res.status(200).json({ message: "Login Succesfully" });
    } catch (error: unknown | any) {
      res.status(401).json({ message: error.message });
    }
  }
  async handleGoogleCallback(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user || typeof req.user === "string") {
        res.status(400).json({ message: "Invalid Google profile data" });
      }
      await this.authService.loginWithGoogle(req.user as IGoogleProfile);
      res.redirect(`https://www.google.com/`);
    } catch (error: unknown | any) {
      console.log(error.message);
      res.status(500).json({ message: "Authentication failed" });
    }
  }
}
