import mongoose, { Schema, Document } from "mongoose";

export interface IReport extends Document {
  phostId: mongoose.Types.ObjectId;
  reporterEmail: string;
  reportType: "POST" | "COMMENT" | "USER";
  reason: "HARASSMENT" | "SPAM" | "HATE" | "VIOLENCE" | "OTHER";
  description: string;
  evidence?: string;
  frequency: "ONCE" | "MULTIPLE";
  acknowledge: boolean;
  createdAt: Date;
}

const ReportSchema: Schema<IReport> = new Schema(
  {
    phostId: {
      type: Schema.Types.ObjectId,
      ref: "Phost",
      required: true,
    },

    // 🟢 Reporter Email (used to prevent duplicate reports)
    reporterEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    reportType: {
      type: String,
      enum: ["POST", "COMMENT", "USER"],
      required: true,
    },

    reason: {
      type: String,
      enum: ["HARASSMENT", "SPAM", "HATE", "VIOLENCE", "OTHER"],
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    evidence: {
      type: String,
      trim: true,
    },

    frequency: {
      type: String,
      enum: ["ONCE", "MULTIPLE"],
      required: true,
    },

    acknowledge: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

ReportSchema.index({ phostId: 1, reporterEmail: 1 }, { unique: true });

const Report =  mongoose.model<IReport>("Report", ReportSchema);
export default Report;