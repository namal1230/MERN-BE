import { Request, Response, NextFunction } from "express";

const ErrorHandling = ((err:any, req:Request, res:Response, next:NextFunction) => {
 if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

export default ErrorHandling;