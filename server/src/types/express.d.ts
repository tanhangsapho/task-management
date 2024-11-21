import { User } from "../database/models/user.model";
import { IUser } from "../database/repo/interface/user.interface";
import { JwtPayload } from "jsonwebtoken";
interface CustomJwtPayload extends JwtPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
  isVerified: boolean;
  // Optional fields that might be useful in your JWT
  photos?: string;
  provider?: "local" | "google" | "github";
}

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: IUser & CustomJwtPayload;
    }
  }
}
