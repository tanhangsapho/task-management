import { inject, injectable } from "tsyringe";
import { AuthService } from "../services/auth.service";
import e, { Request, Response } from "express";
import { IGoogleProfile } from "../database/repo/interface/user.interface";
import getConfig from "../utils/config";
import { clearAuthCookies, setAuthCookies } from "../utils/cookie";

@injectable()
export class AuthController {
  constructor(@inject(AuthService) private readonly authService: AuthService) {}
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await this.authService.loginWithCredentials(email, password);
      setAuthCookies(res, user.accessToken, user.refreshToken);
      res.status(200).json({ message: "Login Succesfully" });
    } catch (error: unknown | any) {
      res.status(401).json({ message: error.message });
    }
  }
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, name, password } = req.body;
      await this.authService.register({ email, password, name });

      res.status(201).json({
        message:
          "Registration successful. Please check your email to verify your account.",
      });
    } catch (error: unknown | any) {
      console.error("Registration error:", error);
      if (error.message?.includes("SSL routines")) {
        res.status(500).json({
          message: "Server configuration error. Please contact support.",
          error: "Email service connection failed",
        });
      } else {
        res.status(400).json({ message: error.message });
      }
    }
  }
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        res.status(401).json({ message: "Refresh token is required" });
      }

      const tokens = await this.authService.refreshToken(refreshToken);
      setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
      res.json({
        message: "Token refreshed successfully",
      });
    } catch (error: any | unknown) {
      res.status(400).json({
        message: error.message,
      });
    }
  }
  async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.query;
      if (!token || typeof token !== "string") {
        throw new Error("Invalid verification token");
      }

      await this.authService.verifyEmail(token);
      // setAuthCookies(res, tokens.accessToken);

      res.json({
        message: "Email verified successfully",
      });
    } catch (error: unknown | any) {
      res.status(400).json({ message: error.message });
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
  async logout(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        res.status(401).json({ message: "Refresh token is required" });
      }

      // Blacklist the refresh token to prevent further use
      await this.authService.logout(refreshToken);

      clearAuthCookies(res);

      res.json({ message: "Logout successful" });
    } catch (error: unknown | any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }
}
