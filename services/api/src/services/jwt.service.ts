import jwt from "jsonwebtoken";

interface TokenPayload {
  userId: string;
}

const ACCESS_EXPIRY = "15m";
const REFRESH_EXPIRY = "30d";

function getAccessSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET غير معرّف");
  }
  return secret;
}

function getRefreshSecret(): string {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET غير معرّف");
  }
  return secret;
}

export function signAccessToken(userId: string): string {
  return jwt.sign({ userId }, getAccessSecret(), { expiresIn: ACCESS_EXPIRY });
}

export function signRefreshToken(userId: string): string {
  return jwt.sign({ userId }, getRefreshSecret(), { expiresIn: REFRESH_EXPIRY });
}

export function verifyAccessToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, getAccessSecret());
  if (typeof decoded !== "object" || decoded === null || !("userId" in decoded)) {
    throw new jwt.JsonWebTokenError("رمز غير صالح");
  }
  const { userId } = decoded as TokenPayload;
  if (typeof userId !== "string") {
    throw new jwt.JsonWebTokenError("رمز غير صالح");
  }
  return { userId };
}

export function verifyRefreshToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, getRefreshSecret());
  if (typeof decoded !== "object" || decoded === null || !("userId" in decoded)) {
    throw new jwt.JsonWebTokenError("رمز غير صالح");
  }
  const { userId } = decoded as TokenPayload;
  if (typeof userId !== "string") {
    throw new jwt.JsonWebTokenError("رمز غير صالح");
  }
  return { userId };
}

export function signTokenPair(userId: string): { accessToken: string; refreshToken: string } {
  return {
    accessToken: signAccessToken(userId),
    refreshToken: signRefreshToken(userId),
  };
}
