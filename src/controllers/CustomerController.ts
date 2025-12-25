import { Request, Response } from "express";
import { generateToken, refreshToken } from "../utils/GenerateToken";
import Users from "../models/CustomerModel";

export const getCustomer = (req: Request, res: Response) => {
    res.status(200).json("Get Request Customer");
}

export const loginCustomer = async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        const user = req.body;
        const token = generateToken(user);
        const refresh = refreshToken(user);

        const saveUser = await Users.create({
            firebaseUid: user.id,
            name: user.name,
            email: user.email,
            profile: user.profile,
            refreshToken: refresh
        })

        res.cookie("refresh", refresh, {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        })
        res.status(200).json({ data: "Customer login Success", token });
    } catch (err) {
        console.error("Login failed:", err);
        return res.status(500).json({
            message: "Internal Server Error",
            error: err instanceof Error ? err.message : "Unknown error",
        });
    }
}