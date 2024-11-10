import mongoose, { Schema } from "mongoose";

export interface IBoard extends Document {
  title: string;
  description?: string;
  userId: Schema.Types.ObjectId;
  lists: Schema.Types.ObjectId[];
  background?: string;
  isArchived: boolean;
  members: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const BoardSchema: Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Board title is required"],
      trim: true,
      maxlength: [100, "Board title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Board description cannot be more than 500 characters"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    lists: [
      {
        type: Schema.Types.ObjectId,
        ref: "List",
      },
    ],
    background: {
      type: String,
      default: "#0079bf", // Default Trello blue color
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate for lists
BoardSchema.virtual("boardLists", {
  ref: "List",
  localField: "_id",
  foreignField: "boardId",
});

// Middleware to populate lists when finding a board
// BoardSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "lists",
//     select: "title position",
//   });
//   next();
// });

export const Board = mongoose.model<IBoard>("Board", BoardSchema);
