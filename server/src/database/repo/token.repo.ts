import { injectable } from "tsyringe";
import { RefreshToken } from "../models/token";
import { IRefreshToken } from "./interface/user.interface";
import crypto from "crypto";
@injectable()
export class TokenRepository {
  async createRefreshToken(userId: string): Promise<IRefreshToken> {
    const token = crypto.randomBytes(40).toString("hex");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    return RefreshToken.create({
      userId,
      token,
      expires,
      blacklisted: false,
    });
  }

  async findRefreshToken(token: string): Promise<IRefreshToken | null> {
    return RefreshToken.findOne({
      token,
      expires: { $gt: new Date() },
      blacklisted: false,
    });
  }

  async blacklistRefreshToken(token: string): Promise<void> {
    await RefreshToken.updateOne({ token }, { blacklisted: true });
  }
}
