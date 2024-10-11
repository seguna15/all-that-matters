import jwt from "jsonwebtoken";
import { redis } from "../config/redis.config.js";

//create cookies
export const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httOnly: true, //prevent XSS attacks cross site scripting attacks
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevents CSRF attack, cross-site request forgery
    maxAge: 15 * 60 * 1000 // 15 minutes
  })
  res.cookie("refreshToken", refreshToken, {
    httOnly: true, //prevent XSS attacks cross site scripting attacks
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevents CSRF attack, cross-site request forgery
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

//set access token cookies
export const setAccessTokenCookies = (res, accessToken) => {
  res.cookie("accessToken", accessToken, {
    httOnly: true, //prevent XSS attacks cross site scripting attacks
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevents CSRF attack, cross-site request forgery
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
}

//generates access and refresh token
export const generateTokens = (userId) => {
  return {
    accessToken: jwt.sign({ userId }, process.env.JWT_ACCESS_KEY, { expiresIn: "15m" }), refreshToken: jwt.sign({ userId }, process.env.JWT_REFRESH_KEY, { expiresIn: "7d" })
  };
};
//generates access token
export const generateAccessTokens = (userId) => {
    return  jwt.sign({ userId }, process.env.JWT_ACCESS_KEY, { expiresIn: "15m" })
};


//gets access token from headers.authorization
export const getAccessTokenFromCookies = (req) => {
  const token = req?.cookies?.accessToken

  if (token === undefined) {
    return "No token found in the header";
  }

  return token;
};

// verifies token
export const verifyToken = (token, secret) => {
  return jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return null;
    } else {
      return decoded;
    }
  });
};

//storeRefreshToken to redis

export const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60) // 7days
} 