import mongoose, { Schema, Types } from "mongoose";

export interface IFollow {
    currentUser: string;
    user: Types.ObjectId;
    createdAt?: Date;
}

const followSchema = new Schema<IFollow>(
    {
        currentUser: {
            type: String, 
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User",
            required: true,
        },

    },
    {
        timestamps: true,
    }
);

followSchema.index(
    { currentUser: 1, user: 1 },
    { unique: true }
);


followSchema.index({ currentUser: 1, user: 1 }, { unique: true });
const Follow = mongoose.model("Follow", followSchema);

export default Follow;
