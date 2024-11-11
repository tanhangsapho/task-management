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
userSchema.pre("save", async function (next) {
  if (this.isModified("password") && typeof this.password === "string") {
    console.log("Original plain password:", this.password);
    this.password = await bcrypt.hash(this.password, 12); // Async hashing
    console.log("Hashed password:", this.password);
  }
  next();
});

userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  // Skip password comparison for Google-authenticated users
  if (this.googleId) {
    console.log("Google-authenticated user, no password comparison needed.");
    return true;
  }

  if (!this.password) {
    console.error("Password field is not populated for comparison.");
    return false;
  }

  const isValid = await bcrypt.compare(password, this.password);
  console.log(
    "Comparing passwords:",
    password,
    this.password,
    "Result:",
    isValid
  );
  return isValid;
};

export const User = mongoose.model<IUserDocument>("User", userSchema);
