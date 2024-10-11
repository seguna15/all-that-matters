import User from "../models/user.model.js";
import ErrorHandler from "../utils/ErrorHandler.util.js";
import { getAccessTokenFromCookies, verifyToken } from "../utils/token.util.js";

const protectedRoute = async (req, res, next) => {
  //get token from cookies
  const token = getAccessTokenFromCookies(req);

  //verify the token
  const decodedUser = verifyToken(token, process.env.JWT_ACCESS_KEY);

  if (!decodedUser) {
    next(new ErrorHandler("Invalid/Expired token, please login again", 401));
  }

  //check if decoded user is a valid user
  const validUser = await User.findById(decodedUser?.userId).select("-password");

  if(!validUser) {
    next(new ErrorHandler("Invalid token, please login again", 403))
  }

  //save the user into the req obj
  req.userAuthId = validUser?._id;
  req.isAdmin = validUser?.isAdmin;
  next();
};

export default protectedRoute