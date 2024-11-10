import mongoose, { Schema } from "mongoose";

export interface ILabel {
  name: string;
  color: string;
}

export interface IChecklist {
  title: string;
  items: {
    text: string;
    isCompleted: boolean;
    completedAt?: Date;
  }[];
}

export interface IAttachment {
  filename: string;
  url: string;
  uploadedAt: Date;
}

export interface ICard extends Document {
  title: string;
  description?: string;
  listId: Schema.Types.ObjectId;
  boardId: Schema.Types.ObjectId;
  position: number;
  dueDate?: Date;
  labels: ILabel[];
  members: Schema.Types.ObjectId[];
  attachments: IAttachment[];
  checklists: IChecklist[];
  isArchived: boolean;
  comments: {
    text: string;
    userId: Schema.Types.ObjectId;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const LabelSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  color: {
    type: String,
    required: true,
    default: "#0079bf",
  },
});

const ChecklistItemSchema: Schema = new Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  completedAt: Date,
});

const ChecklistSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  items: [ChecklistItemSchema],
});

const AttachmentSchema: Schema = new Schema({
  filename: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const CommentSchema: Schema = new Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CardSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Card title is required"],
      trim: true,
      maxlength: [100, "Card title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [5000, "Card description cannot be more than 5000 characters"],
    },
    listId: {
      type: Schema.Types.ObjectId,
      ref: "List",
      required: [true, "List ID is required"],
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
    dueDate: Date,
    labels: [LabelSchema],
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    attachments: [AttachmentSchema],
    checklists: [ChecklistSchema],
    comments: [CommentSchema],
    isArchived: {
      type: Boolean,
      default: false,
    },
    coverImage: {
      type: String,
    },
    isWatched: {
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

CardSchema.index({ boardId: 1, listId: 1, position: 1 });
CardSchema.index({ title: "text", description: "text" });

// Middleware to populate members and comments when finding a card
// CardSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "members",
//     select: "name avatar",
//   }).populate({
//     path: "comments.userId",
//     select: "name avatar",
//   });
//   next();
// });

export const Card = mongoose.model<ICard>("Card", CardSchema);
