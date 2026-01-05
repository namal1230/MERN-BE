import {Request,Response,NextFunction} from "express";
import jsonwebtoken from "jsonwebtoken";

const AuthVerfication=(req:Request,resp:Response,next:NextFunction)=>{

    const secret:string|undefined = process.env.SECRET_CODE;
    const auth:string|undefined = req.headers.authorization;

      if (!auth?.startsWith("Bearer ")) {
        console.log(auth);
        return resp.status(401).json({ message: "Unauthorized" });
    }


    const token = auth.split(" ")[1];
    console.log(token);
    try{
        const status = jsonwebtoken.verify(String(token),String(secret));
        (req as any).user = status;

        next();
    }catch(err){
        resp.status(403).json("Forbidden Error")
    }
}

export default AuthVerfication;

