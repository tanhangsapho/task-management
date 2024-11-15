// utils/cookie.ts

import { Response } from "express";
import getConfig from "../utils/config";

export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken?: string
): void {
  const secure = getConfig().env === "production";

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure,
    sameSite: "strict",
    maxAge: 1800 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure,
    sameSite: "strict",
    maxAge: 604800 * 1000,
  });
}

export function clearAuthCookies(res: Response): void {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: getConfig().env === "production",
    sameSite: "strict",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: getConfig().env === "production",
    sameSite: "strict",
  });
}
