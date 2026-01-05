import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const AuthVerfication = (req: Request, resp: Response, next: NextFunction) => {

    const auth: string | undefined = req.headers.authorization;

    console.log("Headers:", req.headers);

    if (!auth || !auth.startsWith("Bearer ")) {
        resp.status(401).json("Not Verfied Authentication");
    }

    const token = auth?.split(" ")[1];

    if (!token) {
        return resp.status(401).json({ message: "Token missing" });
    }

    jwt.verify(token, process.env.SECRET_CODE as string);

    next();
}

export default AuthVerfication;