import { Schema } from "mongoose";

export interface IUser {
  id?: string;
  email: string;
  password?: string;
  googleId?: string;
  name: string;
  isVerified: boolean;
  role: string;
  lastLogin: Date;
  comparePassword?(password: string): Promise<boolean>;
}
export interface IGoogleProfile {
  id: string;
  displayName: string;
  emails: Array<{ value: string; verified: boolean }>;
}
export interface IAuthResponse {
  token: string;
  user: Omit<IUser, "password">;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface IRegisterDTO {
  email: string;
  password: string;
  name: string;
}

export interface IRefreshToken {
  userId: Schema.Types.ObjectId;
  token: string;
  expires: Date;
  blacklisted: boolean;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface IVerificationToken {
  userId: Schema.Types.ObjectId;
  token: string;
  expires: Date;
}
