import ErrorHandler from "../utils/ErrorHandler.util.js";

const adminRoute = async (req, res, next) => {
  //find the logged in user
  if(req.userAuthId && req.isAdmin){
    next()
  } else {
    next(new ErrorHandler("Access denied, admin only", 403));
  }
};

export default adminRoute;
