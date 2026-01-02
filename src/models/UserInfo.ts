import mongoose from "mongoose";

const userInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  bio: {
    type: String,
    default: ""
  },

  jobTitle: {
    type: String,
    default: "",
  },
  experienceYears: {
    type: String,
    default: ""
  },
  portfolioUrl: {
    type: String,
    default: ""
  },
  githubUrl: {
    type: String,
    default: "",
  },

  linkdinUrl: {
    type: String,
    default: "",
  },

  anotherUrl: {
    type: String,
    default: "",
  },
  skills: {
    type: [String],
    default: []
  },
  profileUrl: {
    type: String,
    default: ""
  }
}, { timestamps: true });

const UserInfo = mongoose.model("UserInfo", userInfoSchema);

export default UserInfo;
