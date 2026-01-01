import mongoose from "mongoose";

export interface IEmail extends mongoose.Document {
  email: string;
  source: "login-issue" | "phost-upload" | "report-user" | "report-phost";
  title?: string;
  body?: string;
  loginType?: "new" | "existing"; // optional, only for login-issue
  userProfile?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EmailSchema = new mongoose.Schema<IEmail>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
    },

    source: {
      type: String,
      enum: ["login-issue","phost-upload","report-user","report-phost"],
      required: true
    },

    title: {
      type: String,
      trim: true
    },

    body: {
      type: String,
      trim: true
    },
      loginType: {
      type: String,
      enum: ["new", "existing"],
      required: false // optional, only for login-issue
    },

    userProfile: {
      type: String, // store profile image URL
      required: false
    }
  },
  {
    timestamps: true // auto adds createdAt & updatedAt
  }
);

const Email = mongoose.model<IEmail>("Email", EmailSchema);
export default Email;
