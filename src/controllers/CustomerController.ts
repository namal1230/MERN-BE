import { Request, Response } from "express";
import { generateToken, refreshToken } from "../utils/GenerateToken";
import Users from "../models/CustomerModel";

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
      { firebaseUid: user.id }, // ✅ real unique key
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