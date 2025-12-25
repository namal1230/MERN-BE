import {Request,Response,NextFunction} from "express";
import jsonwebtoken from "jsonwebtoken";

const AuthVerfication=(req:Request,resp:Response,next:NextFunction)=>{

    const secret:string|undefined = process.env.SECRET_CODE;
    const auth:string|undefined = req.headers.authorization;

    if(!auth){
        resp.status(401).json("Not Verfied Authentication");
    }

    const token = auth?.split(" ")[1];

    try{
        const status = jsonwebtoken.verify(String(secret),String(auth));
        if(status){
            next();
        }
    }catch(err){
        resp.status(403).json("Forbidden Error")
    }
}

export default AuthVerfication;