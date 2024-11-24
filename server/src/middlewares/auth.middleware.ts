import { NextFunction, Request, Response } from "express";
import { authConfig } from "../utils/auth.config";
import jwt from "jsonwebtoken";
import { User, IUserDocument } from "../database/models/user.model";
import { IUser, IUserDTO } from "../database/repo/interface/user.interface";

// Extend the Request type to include our custom user types
declare global {
  namespace Express {
    interface Request {
      user?: IUserDTO;
      rawUser?: IUserDocument;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    console.log("Token:", token);
    if (!token) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, authConfig.jwtSecret!) as {
      id: string;
    };
    console.log("Decoded:", decoded);
    // Fetch the user from database
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    // Convert Mongoose document to plain object and format it
    const userObject: IUserDTO = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      photos: user.photos?.[0],
      googleId: user.googleId,
      githubId: user.githubId,
      isVerified: user.isVerified,
      role: user.role,
      lastLogin: user.lastLogin,
    };

    // Attach both the formatted user object and raw mongoose document
    req.user = userObject;
    req.rawUser = user;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Invalid token" });
    } else {
      console.error("Auth middleware error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
