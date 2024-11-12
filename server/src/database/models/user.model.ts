import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "../repo/interface/user.interface";

export interface IUserDocument extends IUser, Document {
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 8,
      select: false,
    },
    googleId: String,
    name: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    if (!this.password) {
      console.error("No stored password found for user");
      return false;
    }

    if (!candidatePassword) {
      console.error("No candidate password provided");
      return false;
    }

    // Direct comparison of the provided password with stored hash
    const isMatch = await bcrypt.compare(candidatePassword, this.password);

    console.log("Password comparison details:", {
      hasStoredPassword: !!this.password,
      passwordLength: candidatePassword.length,
      isMatch,
    });

    return isMatch;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
};

export const User = mongoose.model<IUserDocument>("User", userSchema);
