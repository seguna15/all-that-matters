import User from "../models/user.model.js";
import ErrorHandler from "../utils/ErrorHandler.util.js";
import bcrypt from "bcryptjs"
import crypto from "node:crypto";
import { generateAccessTokens, generateTokens, setAccessTokenCookies, setCookies, storeRefreshToken, verifyToken } from "../utils/token.util.js";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mail/email.js";
import { OAuth2Client } from "google-auth-library";
import { redis } from "../config/redis.config.js";
import { setUserCart } from "../utils/redis.util.js";

/**
*   @desc   Create new user
*   @route  POST /api/v1/auth/register
*   @access Public
*/
export const register =  async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
   throw new ErrorHandler("Kindly fill name, email & password", 400);

  // check if user exist
  const userExist = await User.findOne({ email });
  if (userExist) {
   throw new ErrorHandler("User already exists", 409);
  }

  

  const verificationToken = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  const user = await User.create({
    name,
    email,
    password,
    verificationToken,
    verificationTokenExpiresAt: Date.now() + 15 * 60 * 1000, //15 minutes
  });

  if (!user) {
   throw new ErrorHandler("User could not be created");
  }

  await user.save();

  //send verification email
  await sendVerificationEmail(user.email, verificationToken);

  return res.status(201).json({
    success: true,
    message: "User created successfully",
    user: {
      ...user._doc,
      password: undefined,
    },
  });
}


/**
*   @desc   Verify user's email
*   @route  POST /api/v1/auth/verify-email
*   @access Public
*/
export const verifyEmail = async (req, res) => {
    const {code} = req.body;

    const user = await User.findOne({
        verificationToken: code,
        verificationTokenExpiresAt: {$gt: Date.now()}
    })

    if(!user)throw new ErrorHandler("Invalid or expired verification code", 400);

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();

    await sendWelcomeEmail(user.email, user.name, `${process.env.CLIENT_URL}/auth/login`)

    return res.status(200).json({
      success: true,
      message: "Welcome Email Sent",
      user: {
        ...user._doc,
        password: undefined,
        sessions: undefined,
      },
    });
}

/**
*   @desc   Login user
*   @route  POST /api/v1/auth/login
*   @access Public
*/
export const login =  async (req, res) => {
  
    const { email, password } = req.body;

    //Find the user by email
    const userFound = await User.findOne({ email });

    if (userFound && (await userFound.comparePassword(password))) {
      // generate access token
      const {accessToken, refreshToken} = generateTokens(userFound._id);
      userFound.lastLogin = new Date();

      await storeRefreshToken(userFound._id, refreshToken);
      await userFound.save();
      setCookies(res, accessToken, refreshToken)
      return res
        .status(200)
        .json({
          success: true,
          message: "User logged in successfully",
          user: {
            ...userFound._doc,
            password: undefined,
          }
        });
    }

   throw new ErrorHandler("Invalid login credential", 403);
  
}


/**
*   @desc   Logout user
*   @route  POST /api/v1/auth/logout
*   @access Public
*/
export const logout =  async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  //if no cookie comes with the request logout the user
  if (refreshToken) {
    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_KEY);
   
    await redis.del(`refresh_token:${decoded.userId}`)
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken")
  return res
     .status(200)
     .json({ success: true, message: "user logged out successfully" });
 
}


/**
*   @desc   refresh access token 
*   @route  POST /api/v1/auth/refresh
*   @access Public
*/
export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  //return forbidden if cookies is not present
  if (!refreshToken) {
     throw new ErrorHandler("No cookie found", 403)
  }

  const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_KEY);
  const storedToken = await redis.get(`refresh_token:${decoded.userId}`);
 
  if(storedToken !== refreshToken) {
    return res.status(403).json({success: false, message: "invalid token"})
  }

  const accessToken= generateAccessTokens(decoded.userId);
  setAccessTokenCookies(res, accessToken)
  return res.status(200).json({ success: true, message: "Token generated successfully" });
};


/**
*   @desc    Send password reset email to user
*   @route  POST /api/v1/auth/forgot-password
*   @access Public
*/
export const forgotPassword = async(req, res) => {
    const {email} = req.body;
    
    const user = await User.findOne({email});

    if(!user){
      throw new ErrorHandler("User not found", 404);
    }

    const resetToken =  crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

    //send email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`, 
      next
    );

    res.status(200).json({success: true, message: "Password reset link has been sent to your email"})
}


/**
*   @desc    Reset user password with token sent to email
*   @route  POST /api/v1/auth/reset-password/:token
*   @access Public
*/
export const resetPassword = async(req, res) => {
    const {token} = req.params;
    const {password} = req.body;
    console.log(password)
    const user = await User.findOne({
        resetPasswordToken: token, resetPasswordExpiresAt: {$gt: Date.now()}
    });
    
    //return error if user is not found
    if(!user)throw new ErrorHandler("User not found", 404);

   
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    //send email
    await sendResetSuccessEmail(
      user.email,
      next
    );

    res.status(200).json({success: true, message: "Password reset successful"})
}


//Google OAuth Request
export const googleOathRequest = async (req, res) => {
  
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Referrer-Policy", "no-referrer-when-downgrade");

  const redirectUrl = "http://127.0.0.1:8000/api/v1/auth/oauth";

  const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUrl
  );

  const authorizeURL = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope:
      "https://www.googleapis.com/auth/userinfo.email openid https://www.googleapis.com/auth/userinfo.profile",
    prompt: "consent",
  });

  res.json({url: authorizeURL})
}


//Google OAuth callback
export const googleOAuth = async (req, res) => {
  const code = req.query.code;
  
  try {
    const redirectUrl = "http://127.0.0.1:8000/api/v1/auth/oauth"
    const oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUrl
    );
    const response = await oAuth2Client.getToken(code);
    await oAuth2Client.setCredentials(response.tokens);
   
    const user = oAuth2Client.credentials;
    
    const ticket = await oAuth2Client.verifyIdToken({idToken: user.id_token, audience: process.env.GOOGLE_CLIENT_ID});
    const payload = ticket.getPayload();
    
    //const userId = payload["sub"];
    const name = payload["name"];
    const email = payload["email"];
    const isVerified = payload["email_verified"];

    const foundUser = await User.findOne({email})
    if(foundUser && foundUser?.authProvider === "google"){
         return res
           .status(303)
           .redirect(
             `${process.env.CLIENT_URL}/auth/oauth-success/${foundUser.email}`
           );
    }
    
    const newUser = await User.create({
      username: name,
      email,
      password: Date.now().toString(),
      isVerified,
      lastLogin: new Date(),
      authProvider: "google",
    });

    await newUser.save();
     return res
       .status(303)
       .redirect(
         `${process.env.CLIENT_URL}/auth/oauth-success/${newUser.email}`
       );
  } catch (error) {
    console.log(error)
    return res.status(303).redirect(`${process.env.CLIENT_URL}/auth/login`);
  }
}

/**
*   @desc    Fetch user after oauth success
*   @route  POST /api/v1/auth/google-auth-successful/:email
*   @access Public
*/
export const onOauthSuccess = async (req,  res) => {
  
  const { email } = req.body;

  //Find the user by email
  const userFound = await User.findOne({ email });

  if (userFound && userFound.authProvider === "google") {
    
    // generate access token
    const {accessToken, refreshToken} = generateTokens(userFound._id);
    await storeRefreshToken(userFound._id, refreshToken);
    userFound.lastLogin = new Date();
    await userFound.save();
    setCookies(res, accessToken, refreshToken)
    return res
      .status(200)
      .json({
        success: true,
        message: "User logged in successfully",
        user: {
          ...userFound._doc,
          password: undefined,
        }
      });
  }

 throw new ErrorHandler("Invalid login credential", 403);
};