import Coupon from "../models/coupon.model.js";
import ErrorHandler from "../utils/ErrorHandler.util.js";
/**
 *   @desc   Create Coupon
 *   @route  POST /api/v1/coupon/
 *   @access Private/Admin
 */
export const createCoupon = async (req, res) => {
  const { code, discountPercentage, maxUsage, expirationDate } = req.body;

  //check if discount in a number
  if (isNaN(discountPercentage)) {
    throw new ErrorHandler("Coupon discount value should be a number", 400);
  }

  //create coupon
  const coupon = await Coupon.create({
    code: code?.toUpperCase(),
    expirationDate,
    discountPercentage,
    maxUsage,
  });

  //return response
  return res.status(201).json({
    success: true,
    message: "Coupon created successfully",
    coupon,
  });
};

/**
 *   @desc   Validate Coupon
 *   @route  POST /api/v1/coupon/validate
 *   @access Private/User
 */
export const validateCoupon = async (req, res) => {
   
    const code = req?.body?.code;
    
  
    const coupon = await Coupon.findOne({code, isActive: true});

    if(!coupon){
        throw new ErrorHandler("Coupon not found", 404)
    }

    if (coupon.expirationDate < Date.now()) {
      coupon.isActive = false;
      await coupon.save();
      throw new ErrorHandler("Coupon has expired", 400);
    }

    return res.status(200).json({
        success: true,
        message: `${coupon.code} ${coupon.discountPercentage}% applied`,
        coupon: {
            code: coupon?.code,
            discountPercentage: coupon?.discountPercentage,
        },
    })
};


/**
 *   @desc   Fetch Coupon
 *   @route  POST /api/v1/coupon/latest
 *   @access Public
 */
export const fetchActiveCoupons = async (req, res) => {
  const id = req?.userAuthId;
  
  let activeCoupon = await Coupon.findOne({
    userId: { $eq: id },
    isActive: true,
  })
    
   

  if (activeCoupon) {
    return res.status(200).json({
      success: true,
      message: "User Coupon fetched successfully",
      coupon: activeCoupon,
    });
  }

  activeCoupon = await Coupon.find({ isActive: true })
    .sort({ expirationDate: 1 })
    .limit(1);

  if(!activeCoupon) {
    throw new ErrorHandler("No active coupons found", 404);
  }
    
    

    
  return res.status(200).json({
    success: true,
    message: "Coupon fetched successfully",
    coupon: activeCoupon,
  });
};

/**
 *   @desc   Fetch All Coupon
 *   @route  GET /api/v1/coupon/
 *   @access Private/Admin
 */
export const fetchAllCoupon = async (req, res) => {
  const coupons = await Coupon.find();

  //pagination
  return res.status(200).json({
    success: true,
    message: "Coupon fetched successfully",
    coupons,
  })
};

/**
*   @desc   GET single Coupon
*   @route  GET /api/v1/coupons/fetch-single/id
*   @access Private/Admin
*/
export const getCoupon = async(req, res) => {

  const id  = req.params.id;
  
  
  const coupon = await Coupon.findById(id)
  
  //check if not found
  if(coupon === null) throw new ErrorHandler("Coupon not found", 404)

  //send response
  return res.status(200).json({
    success: true,
    message: `Coupon fetched`,
    coupon,
  });
}

/**
 *   @desc   Update Coupon
 *   @route  PUT /api/v1/coupon/:id
 *   @access Private/Admin
 */
export const updateCoupon = async (req, res) => {
  const id = req.params.id;
  const { code, discountPercentage, maxUsage, expirationDate } = req.body;

  //check if discount in a number
  if (isNaN(discountPercentage)) {
    throw new ErrorHandler("Coupon discount value should be a number", 400);
  }

  //create coupon
  const coupon = await Coupon.findByIdAndUpdate(
    id,
    {
      code: code?.toUpperCase(),
      expirationDate,
      discountPercentage,
      maxUsage,
    },
    { new: true }
  );

  //return response
  return res.status(201).json({
    success: true,
    message: "Coupon updated successfully",
    coupon,
  });
};


/**
 *   @desc   Delete Coupon
 *   @route  Patch /api/v1/coupon/:id
 *   @access Private/Admin
 */
export const deleteCoupon = async (req, res) => {
  const id = req.params.id;
  
  //create coupon
  const coupon = await Coupon.findByIdAndDelete(id);

  //return response
  return res.status(201).json({
    success: true,
    message: "Coupon created successfully",
    coupon,
  });
};


/**
*   @desc   toggle coupon activation
*   @route  Patch /api/v1/coupons/toggle-activation/:id
*   @access Private/Admin
*/
export const toggleActivation = async (req,res) => {
    const id = req.params.id;
    const coupon = await Coupon.findById(id);
    if(coupon) {
        coupon.isActive = !coupon.isActive;
        const updatedCoupon = await coupon.save();
        
        return res.status(200).json({
            success: true,
            message: `Coupon ${updatedCoupon.code} update to ${updatedCoupon.isActive ? 'Yes' : 'No'}`,
            coupon: updatedCoupon
        })
    }

   throw new ErrorHandler("No Coupon found", 404);
}




