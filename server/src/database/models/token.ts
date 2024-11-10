import mongoose from "mongoose";
import { IRefreshToken } from "../repo/interface/user.interface";

const TokenSchema = new mongoose.Schema<IRefreshToken>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
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
  blacklisted: {
    type: Boolean,
    default: false,
  },
});

export const RefreshToken = mongoose.model<IRefreshToken>("Token", TokenSchema);
