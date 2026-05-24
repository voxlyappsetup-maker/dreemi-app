import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../services/jwt.service";

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  const token =
    authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;

  if (!token) {
    res.status(401).json({ success: false, error: "رمز الوصول مطلوب" });
    return;
  }

  if (!process.env.JWT_SECRET) {
    res.status(500).json({ success: false, error: "خطأ في إعداد الخادم" });
    return;
  }

  try {
    const { userId } = verifyAccessToken(token);
    req.userId = userId;
    next();
  } catch {
    res.status(401).json({
      success: false,
      error: "رمز الوصول غير صالح أو منتهي الصلاحية",
    });
  }
}
