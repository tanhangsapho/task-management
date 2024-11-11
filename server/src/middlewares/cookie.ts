import { Request, Response, NextFunction } from "express";

export const setCookie = (req: Request, res: Response, next: NextFunction) => {
  const tokens = res.locals.tokens;

  if (tokens && tokens.refreshToken) {
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }

  next();
};
