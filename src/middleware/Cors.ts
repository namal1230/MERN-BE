import { Request, Response, NextFunction } from "express";

const CorsPolicy =  ((req:Request, res:Response, next:NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "https://smart-blog-dev.vercel.app");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

export default CorsPolicy;