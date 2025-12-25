import mongoose from "mongoose"

export interface IUser extends mongoose.Document{
    firebaseUid:string;
    name:string;
    email:string;
    profile?:string;
    refreshToken:string;
    role:"user" | "admin";
}

const UserSchema = new mongoose.Schema<IUser>({
    firebaseUid:{
        type:"String",
        unique:true,
        require:true
    },
    name:{
        type:"String",
        unique:true,
        require:true
    },
    email:{
        type:"String",
        unique:true,
        require:true
    },
    profile:{
        type:"String",
        unique:true,
        require:true
    },
    refreshToken:{
        type:"String",
        unique:true,
        require:true
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
},
 { timestamps: true }
);

const Users = mongoose.model<IUser>("User",UserSchema)
export default Users;