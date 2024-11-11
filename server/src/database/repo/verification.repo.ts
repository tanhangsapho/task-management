import { injectable } from "tsyringe";
import { IVerificationToken } from "./interface/user.interface";
import crypto from "crypto";
import { VerificationToken } from "../models/verification";
@injectable()
export class VerificationRepository {
  async createToken(userId: string): Promise<IVerificationToken> {
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date();
    expires.setHours(expires.getHours() + 24); // 24 hour expiration

    return VerificationToken.create({
      userId,
      token,
      expires,
    });
  }
  async findByToken(token: string): Promise<IVerificationToken | null> {
    return VerificationToken.findOne({ token, expires: { $gt: new Date() } });
  }

  async deleteToken(token: string): Promise<void> {
    await VerificationToken.deleteOne({ token });
  }
}
