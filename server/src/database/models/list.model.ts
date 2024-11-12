import mongoose, { Schema } from "mongoose";

export interface IList extends Document {
  title: string;
  boardId: Schema.Types.ObjectId;
  position: number;
  cards: Schema.Types.ObjectId[];
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ListSchema: Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "List title is required"],
      trim: true,
      maxlength: [50, "List title cannot be more than 50 characters"],
    },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: [true, "Board ID is required"],
    },
    position: {
      type: Number,
      required: true,
      default: 0,
    },
    cards: [
      {
        type: Schema.Types.ObjectId,
        ref: "Card",
      },
    ],
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for efficient querying and sorting
ListSchema.index({ boardId: 1, position: 1 });

// Virtual populate for cards
ListSchema.virtual("listCards", {
  ref: "Card",
  localField: "_id",
  foreignField: "listId",
});

export const List = mongoose.model<IList>("List", ListSchema);
