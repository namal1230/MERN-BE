import { Request, Response, NextFunction } from "express";

const CorsPolicy =  ((req:Request, res:Response, next:NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "https://smart-blog-dev.vercel.app");
  next();
});

export default CorsPolicy;