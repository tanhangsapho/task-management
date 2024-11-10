import mongoose, { Schema } from "mongoose";
import { IVerificationToken } from "../repo/interface/user.interface";

const verificationTokenSchema = new mongoose.Schema<IVerificationToken>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  expires: {
    type: Date,
    required: true,
  },
});

export const VerificationToken = mongoose.model<IVerificationToken>(
  "VerificationToken",
  verificationTokenSchema
);
