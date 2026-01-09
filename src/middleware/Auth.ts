import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const AuthVerfication = (req: Request, resp: Response, next: NextFunction) => {

    const auth: string | undefined = req.headers.authorization;

    console.log("Headers:", req.headers);

    if (!auth || !auth.startsWith("Bearer ")) {
        return resp.status(401).json("Not Verfied Authentication");
    }

    console.log("Now checked hraders..")

    const token = auth?.split(" ")[1];

    console.log("token");

    if (!token) {
        return resp.status(401).json({ message: "Token missing" });
    }

    console.log("now token is verified")
    try {
        const decoded = jwt.verify(
            token,
            process.env.SECRET_CODE as string
        );
        console.log("Now coorect decoded.."+decoded);
        (req as any).user = decoded;
        next();
    } catch (err) {
        return resp.status(403).json({
            message: "Invalid or expired token"
        });
    }
}

export default AuthVerfication;