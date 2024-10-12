import { redis } from "../config/redis.config.js";
import Coupon from "../models/coupon.model.js";
import ErrorHandler from "../utils/ErrorHandler.util.js";
import { updateActiveCouponCache, validateCacheCoupon, validateDBCoupon } from "../utils/coupon.util.js"; 
/**
 *   @desc   Create Coupon
 *   @route  POST /api/v1/coupon/
 *   @access Private/Admin
 */
export const createCoupon = async (req, res) => {
  const { code, discountPercentage, expirationDate } = req.body;

  //check if discount in a number
  if (isNaN(discountPercentage)) {
    throw new ErrorHandler("Coupon discount value should be a number", 400);
  }

  //create coupon
  const coupon = await Coupon.create({
    code: code?.toUpperCase(),
    expirationDate,
    discountPercentage,
    userId: req.userAuthId,
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
    
    const coupons = await redis.get("active_coupons") ? JSON.parse(await redis.get("active_coupons")) :  null;

    //find in redis cache
    let coupon = coupons?.find(coupon => coupon?.code === code && coupon.isActive);
   

    // if coupon is in redis cache
    if(coupon) {
      await validateCacheCoupon(coupons, coupon)
      return res.status(200).json({
        success: true,
        message: `${coupon.code} ${coupon.discountPercentage}% applied`,
        coupon: {
          code: coupon.code,
          discountPercentage: coupon.discountPercentage,
        },
      });
    }


    coupon = await Coupon.findOne({code, isActive: true});

    if(!coupon){
        throw new ErrorHandler("Coupon not found", 404)
    }

    await validateDBCoupon(coupon)

    return res.status(200).json({
        success: true,
        message: `${coupon.code} ${coupon.discountPercentage}% applied`,
        coupon: {
            code: coupon.code,
            discountPercentage: coupon.discountPercentage,
        },
    })
};


/**
 *   @desc   Fetch Coupon
 *   @route  POST /api/v1/coupon/latest
 *   @access Public
 */
export const fetchActiveCoupons = async (req, res) => {
  let activeCoupons = await redis.get("active_coupons");
  if (activeCoupons) {
    return res.status(200).json({
      success: true,
      message: "Featured products fetched successfully",
      products: JSON.parse(activeCoupons),
    });
  }

  
    activeCoupons = await Coupon.find({ isActive: true }).sort({ expirationDate: 1 });
    if(!activeCoupons) {
      throw new ErrorHandler("No active coupons found", 404);
    }
    
    await redis.set("active_coupons", JSON.stringify(activeCoupons));

  return res.status(200).json({
    success: true,
    message: "Coupon fetched successfully",
    coupons: activeCoupons,
  })
};

/**
 *   @desc   Fetch All Coupon
 *   @route  POST /api/v1/coupon/
 *   @access Private/Admin
 */
export const fetchAllCoupon = async (req, res) => {
  const coupon = await Coupon.find();

  //pagination
  res.status(200).json({
    success: true,
    message: "Coupon fetched successfully",
    coupon,
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
  const { code, discountPercentage, expirationDate } = req.body;

  //check if discount in a number
  if (isNaN(discountPercentage)) {
    throw new ErrorHandler("Coupon discount value should be a number", 400);
  }

  //create coupon
  const coupon = await Coupon.findByIdAndUpdate( id,{
    code: code?.toUpperCase(),
    expirationDate,
    discountPercentage,
    userId: req.userAuthId,
  }, {new: true});

  //return response
  return res.status(201).json({
    success: true,
    message: "Coupon created successfully",
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
export const toggleActivation = async (req,res, next) => {
    const id = req.params.id;
    const coupon = await Coupon.findById(id);
    if(coupon) {
        coupon.isActive = !coupon.isActive;
        const updatedCoupon = await coupon.save();
        await updateActiveCouponCache()
        return res.status(200).json({
            success: true,
            message: false,
            coupon: updatedCoupon
        })
    }

   throw new ErrorHandler("No Coupon found", 404);
}




