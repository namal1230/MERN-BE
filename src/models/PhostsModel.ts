import mongoose from "mongoose"

export interface IBodyBlock {
  type: "TEXT" | "IMG" | "VIDEO" | "UNSPLASH" | "EMBED" | "CODE";
  value: string;
}

export interface IPhosts extends mongoose.Document{
    title:string;
    body: IBodyBlock[];
    code?:string;
    username:string;
    email:string;
    status:string;
}

const BodyBlockSchema = new mongoose.Schema<IBodyBlock>(
  {
    type: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  },
  { _id: false }
);


const PhostsSchema = new mongoose.Schema<IPhosts>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    body: {
      type: [BodyBlockSchema],
      required: true
    },
    code: {
      type: String
    },
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "published", "archived"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Phosts = mongoose.model<IPhosts>("Phosts",PhostsSchema)
export default Phosts;