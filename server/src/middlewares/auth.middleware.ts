import { NextFunction, Request, Response } from "express";
import { authConfig } from "../utils/auth.config";
import jwt from "jsonwebtoken";
import {
  IGithubProfile,
  IGoogleProfile,
} from "../database/repo/interface/user.interface";
declare global {
  namespace Express {
    interface Request {
      user?: IGoogleProfile | IGithubProfile;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    // Decode the token to extract the userId
    const decoded = jwt.verify(token, authConfig.jwtSecret!) as {
      id: string;
    };
    if (req.user) {
      req.user.id = decoded.id;
    } else {
      res
        .status(401)
        .json({ message: "Authentication failed: no user profile" });
      return;
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
