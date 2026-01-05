import { Request, Response } from "express";
import { generateToken, refreshToken } from "../utils/GenerateToken";
import Users from "../models/CustomerModel";
import UserInfo from "../models/UserInfo";
import Follow from "../models/FollowSchema";
import Phosts, { IBodyBlock } from "../models/PhostsModel";
import { verifyRefreshToken } from "../utils/VerifyRefreshToken";

export const getCustomer = (req: Request, res: Response) => {
  res.status(200).json("Get Request Customer");
}

export const loginCustomer = async (req: Request, res: Response) => {
    console.log("Request body:", req.body); // add this
  console.log("Request headers:", req.headers);
  console.log("trigger");

  try {
    const user = req.body;

    if (!user?.id || !user?.email) {
      return res.status(400).json({ message: "Invalid user data" });
    }

    const existingUser = await Users.findOne({ firebaseUid: user.id });

    const role: "user" | "admin" = existingUser?.role || "user";


    const status = existingUser?.status || "VALID";

    if (existingUser?.status !== "VALID") {
      return res.status(403).json({ message: "Your Account Has Restricted." });
    }


    const token = generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role,
      status,
    });

    const refresh = refreshToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role,
      status,
    });

    const updatedUser = await Users.findOneAndUpdate(
      { $or: [{ firebaseUid: user.id }, { email: user.email }] },
      {
        $set: {
          firebaseUid: user.id,
          name: user.name,
          email: user.email,
          profile: user.profile || `default-${Date.now()}`,
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
          role,
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
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profile: updatedUser.profile,
        role: updatedUser.role,
        status: updatedUser.status,
      },
    });
  } catch (err) {
    console.error("Login failed:", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

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

export const getFollowingPhosts = async (req: Request, res: Response) => {
  try {
    const { currentUser } = req.query;

    if (!currentUser) {
      return res.status(400).json({ message: "currentUser is required" });
    }

    const follows = await Follow.find({ currentUser })
      .select("user")
      .lean();

    if (!follows.length) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
      });
    }

    const followedUserIds = follows.map(f => f.user);

    const users = await Users.find({
      _id: { $in: followedUserIds },
      status: "VALID",
    })
      .select("name")
      .lean();

    if (!users.length) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
      });
    }

    const usernames = users.map(u => u.name);

    const phosts = await Phosts.aggregate([
      {
        $match: {
          status: "published",
          username: { $in: usernames },
        },
      },

      { $sort: { createdAt: -1 } },

      {
        $lookup: {
          from: "phostreactions",
          localField: "_id",
          foreignField: "phostId",
          as: "reactions",
        },
      },

      {
        $addFields: {
          likeCount: {
            $size: {
              $filter: {
                input: "$reactions",
                as: "r",
                cond: { $eq: ["$$r.liked", true] },
              },
            },
          },
          commentCount: {
            $size: {
              $filter: {
                input: "$reactions",
                as: "r",
                cond: {
                  $and: [
                    { $ne: ["$$r.comment", ""] },
                    { $ne: ["$$r.comment", null] },
                  ],
                },
              },
            },
          },
        },
      },

      {
        $project: {
          title: 1,
          body: 1,
          createdAt: 1,
          username: 1,
          likeCount: 1,
          commentCount: 1,
        },
      },
    ]);

    const data = phosts.map(p => {
      const firstImage = p.body.find(
        (b: IBodyBlock) => b.type === "IMG" || b.type === "UNSPLASH"
      );

      return {
        _id: p._id.toString(),
        title: p.title,
        createdAt: p.createdAt.toISOString(),
        username: p.username,
        image: firstImage ? firstImage.value : null,
        likeCount: p.likeCount,
        commentCount: p.commentCount,
      };
    });

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });

  } catch (error) {
    console.error("Get following phosts error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch following phosts",
    });
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const refreshTokenFromCookie = req.cookies?.refresh;
    console.log(refreshTokenFromCookie);
    if (!refreshTokenFromCookie) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = verifyRefreshToken(refreshTokenFromCookie);
  
    if (!decoded) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const user = await Users.findOne({ refreshToken: refreshTokenFromCookie });
    if (!user) {
      return res.status(403).json({ message: "Refresh token not found" });
    }

    const newAccessToken = generateToken({
      id: user.firebaseUid,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (err) {
    return res.status(500).json({ message: "Refresh failed" });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refresh;
    console.log("Refresh token from cookie:", refreshToken);
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const user = await Users.findOne({ refreshToken });
    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    const accessToken = generateToken({
      id: user.firebaseUid,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });

    return res.status(200).json({ user, accessToken });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch user" });
  }
};