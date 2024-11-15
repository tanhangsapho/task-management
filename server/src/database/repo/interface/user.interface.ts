import { Schema } from "mongoose";

export interface IUser {
  id?: string;
  email: string;
  password?: string;
  githubId?: string;
  googleId?: string;
  photos?: string;
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
  photos: Array<{ value: string }>;
}
export interface IGithubProfile {
  id: string;
  displayName: string;
  emails: Array<{ value: string; verified: boolean }>;
  photos: Array<{ value: string }>;
}
export interface IAuthResponse {
  token: string;
  user: Omit<IUser, "password">;
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
