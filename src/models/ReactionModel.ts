import mongoose, { Schema, Document } from "mongoose";

export interface IPhostReaction extends Document {
  phostId: mongoose.Types.ObjectId;
  username: string;
  profilePicture?: string;
  liked: boolean;
  comment?: string;
  status?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PhostReactionSchema = new Schema<IPhostReaction>(
  {
    phostId: {
      type: Schema.Types.ObjectId,
      ref: "Phosts",
      required: true,
      index: true,
    },

    username: {
      type: String,
      required: true,
    },

    profilePicture: {
      type: String,
    },

    liked: {
      type: Boolean,
      default: false,
    },

    comment: {
      type: String,
    },

    status: {
      type: Boolean,
      default: true,
      required: false
    },
  },
  { timestamps: true }
);

PhostReactionSchema.index({ phostId: 1, username: 1 });
PhostReactionSchema.index({ phostId: 1 });

const Reaction = mongoose.model<IPhostReaction>(
  "PhostReaction",
  PhostReactionSchema
);

export default Reaction;
