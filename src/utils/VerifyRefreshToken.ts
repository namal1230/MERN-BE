import jwt from "jsonwebtoken";

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(
      token,
      process.env.REFRESH_CODE as string
    );
  } catch {
    return null;
  }
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string);
  } catch {
    return null;
  }
};