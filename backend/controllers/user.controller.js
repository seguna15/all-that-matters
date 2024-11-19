import User from "../models/user.model.js"
import ErrorHandler from "../utils/ErrorHandler.util.js"

/**
*   @desc    Fetch user profile
*   @route  POST /api/v1/users/get-user-profile
*   @access Private/User
*/
export const getUserProfile = async (req,res, next) => {
    const user = await User.findById(req.userAuthId)

    if(!user) {
        next(new ErrorHandler("User not found"), 403);
    }

    return res.status(200).json({
        success: true,
        message: "User profile fetched",
        user: {
            ...user._doc,
            password: undefined,
            sessions: undefined,
        }
    })
}

/**
 * @desc Get all customers 
 * @route GET /api/v1/users/customers
 * @access Private
 */
export const getAllCustomers = async (req, res) => {
  const customers = await User.find()

  return res.status(200).send({
    success: true,
    message: "Users fetched successfully",
    customers
  })
}


/**
 * @desc Toggle user role 
 * @route PATCH /api/v1/users/toggle/role/:id
 * @access Private
 */
export const toggleUserRole = async (req, res) => {
  const id = req.params.id;
  const userFound = await User.findById(id);

  if(!userFound) {
    throw new ErrorHandler("User not found", 404);
  }

  userFound.isAdmin = !userFound?.isAdmin;
  await userFound.save();


  return res.status(201).json({
    success: true,
    message: `User role updated to ${userFound.isAdmin ? 'admin' : 'user'}`,
    user: userFound
  })
}



/**
 * @desc Toggle user status 
 * @route PATCH /api/v1/users/toggle/status/:id
 * @access Private
 */
export const toggleUserStatus = async (req, res) => {
  const id = req.params.id;
  const userFound = await User.findById(id);

  if(!userFound) {
    throw new ErrorHandler("User not found", 404);
  }

  userFound.isVerified = !userFound?.isVerified;
  await userFound.save();


  return res.status(201).json({
    success: true,
    message: `User role updated to ${userFound.isVerified ? "verified" : "unverified"}`,
    user: userFound,
  });
}



/**
 * @desc Get user profile
 * @route PATCH /api/v1/users/update/shipping
 * @access Private
 */
export const updateShippingAddress = async (req, res) => {
  const {firstName, lastName, address, city, postalCode, province, country, phoneNumber} = req.body;

  //find user
  const user = await User.findByIdAndUpdate(req.userAuthId, {
    shippingAddress: {
      firstName,
      lastName,
      address,
      city,
      postalCode,
      province,
      country,
      phoneNumber,
    },
    hasShippingAddress: true
  }, {new: true});

  return res.status(201).json({
    success: true,
    message: "User shipping address updated successfully",
    user
  })
}



