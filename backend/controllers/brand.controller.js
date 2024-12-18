import Brand from "../models/brand.model.js";

import ErrorHandler from "../utils/ErrorHandler.util.js";

/**
*   @desc   Create new Brand
*   @route  POST /api/v1/brands
*   @access Private/Admin
*/
export const createBrand = async (req,res) => {
   
    const {name} = req.body;
    
    //brand exists
    const brandFound = await Brand.findOne({name: name.toLowerCase()});
    if(brandFound){
        throw new ErrorHandler("Brand already exists", 409);
    }

    //create
    const brand = await Brand.create({
      name,
      user: req.userAuthId,
    });

    return res.status(201).json({
        success: true,
        message: "Brand created successfully",
        brand
    })
}

/**
*   @desc   Get all Brands
*   @route  GET /api/v1/brands
*   @access Public
*/
export const getBrands = async (req,res) => {
    const brands = await Brand.find()
    
    return res.status(200).json({
        success: true,
        message: "Brands fetched successfully",
        brands
    })
}

/**
*   @desc   Get Single Brands
*   @route  GET /api/v1/brands/:id
*   @access Public
*/

export const getBrand = async (req,res) => {
    const {id} = req.params;
  
    const brand = await Brand.findById(id)
    if (!brand) {
      throw new ErrorHandler("Brand not found", 404);
    }

    return res.status(200).json({
        success: true,
        message: "Brand fetched successfully",
        brand
    })
}

/**
 * @desc Update Brand
 * @route PUT /api/v1/brands/:id/update
 * @access Private/Admin
*/
export const updateBrand = async (req, res) => {
    const { name } = req.body;

    const id = req.params.id;
    const brand = await Brand.findById(id);

    if(!brand){
      throw new ErrorHandler("Brand not found", 404);
    }

    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      {
        name,
      },
      {
        new: true,
      }
    );
    
    

   
   return res.status(200).json({
        success: true,
        message: "Brand updated successfully",
        brand: updatedBrand,
    })
}


/**
 * @desc Delete brand
 * @route DELETE /api/v1/brands/:id/delete
 * @access Private/Admin
*/
export const deleteBrand = async (req, res) => {
    const id = req.params.id;

    const brand = await Brand.findByIdAndDelete(id);

    if (!brand) {
      throw new ErrorHandler("Brand not found", 404);
    }

    return res.status(200).json({
      success: true,
      message: "Brand deleted successfully",
      brand,
    });
}