import { Request, Response } from "express";
import { generateToken, refreshToken } from "../utils/GenerateToken";
import Users from "../models/CustomerModel";
import UserInfo from "../models/UserInfo";
import Follow from "../models/FollowSchema";
import mongoose from "mongoose";

export const getCustomer = (req: Request, res: Response) => {
  res.status(200).json("Get Request Customer");
}

export const loginCustomer = async (req: Request, res: Response) => {

  try {
    const user = req.body;

    if (!user?.id || !user?.email) {
      return res.status(400).json({ message: "Invalid user data" });
    }

    const token = generateToken(user);
    const refresh = refreshToken(user);

    const updatedUser = await Users.findOneAndUpdate(
      { firebaseUid: user.id },
      {
        $set: {
          firebaseUid: user.id,
          name: user.name,
          email: user.email,
          profile: user.profile,
          refreshToken: refresh,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    await UserInfo.findOneAndUpdate(
      { email: user.email },
      {
        $setOnInsert: {
          name: user.name,
          email: user.email,
          profileUrl: user.profile || "",
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    res.cookie("refresh", refresh, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(200).json({
      message: "Customer login success",
      token,
      user: updatedUser,
    });
  } catch (err) {
    console.error("Login failed:", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
}

export const saveUserInfo = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      bio,
      jobTitle,
      experienceYears,
      portfolioUrl,
      githubUrl,
      linkdinUrl,
      anotherUrl,
      skills,
      profileUrl,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    const updatedUser = await UserInfo.findOneAndUpdate(
      { email },
      {
        $set: {
          name,
          email,
          bio: bio ?? "",
          jobTitle: jobTitle ?? "",
          experienceYears: experienceYears ?? "",
          portfolioUrl: portfolioUrl ?? "",
          githubUrl: githubUrl ?? "",
          linkdinUrl: linkdinUrl ?? "",
          anotherUrl: anotherUrl ?? "",
          skills: Array.isArray(skills) ? skills : [],
          profileUrl: profileUrl ?? "",
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({
      message: "User info saved successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("SaveUserInfo Error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getUserInfoByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;

    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await UserInfo.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getUserInfoByName = async (req: Request, res: Response) => {
  try {
    const { name } = req.query;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "Name is required" });
    }

    const user = await UserInfo.findOne({ name: name });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const followUser = async (req: Request, res: Response) => {
  try {
    const { name, currentUser } = req.query as { name: string; currentUser: string };

    if (!name || !currentUser) {
      return res.status(400).json({ message: "Fields are required" });
    }

    const targetUser = await Users.findOne({ name });
    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" });
    }

    if (currentUser === targetUser.firebaseUid) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    const follow = await Follow.create({
      currentUser,
      user: targetUser._id,
    });

    return res.status(201).json({ message: "User followed successfully", follow });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getFollowersCountByName = async (req: Request, res: Response) => {
  try {
    const { name } = req.query as { name: string };

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const targetUser = await Users.findOne({ name: new RegExp(`^${name.trim()}$`, 'i') });

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const followersCount = await Follow.countDocuments({ user: targetUser._id });

    return res.status(200).json({ name: targetUser.name, followers: followersCount });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};