import Category from "../models/category.model.js";
import { deleteImage } from "../utils/deleteImage.util.js";
import ErrorHandler from "../utils/ErrorHandler.util.js";

/**
*   @desc   Create new Category
*   @route  POST /api/v1/categories
*   @access Private/Admin
*/
export const createCategory = async (req,res) => {
   
    const convertedImage = req.file.path;
    const {name} = req.body;
    
    //category exists
    const categoryFound = await Category.findOne({name: name.toLowerCase()});
    if(categoryFound){
      await deleteImage(convertedImage);
      throw new ErrorHandler("Category already exists", 409);
    }

    //create
    const category = await Category.create({
      name: name?.toLowerCase(),
      user: req.userAuthId,
      image: convertedImage,
    });

    return res.status(201).json({
        success: true,
        message: "Category created successfully",
        category
    })
}

/**
*   @desc   Get all Categories
*   @route  GET /api/v1/categories
*   @access Public
*/

export const getCategories = async (req,res) => {
    const categories = await Category.find()
    
    //.populate("user")
    
    res.status(200).json({
        success: true,
        message: "Categories created successfully",
        categories
    })
}

/**
*   @desc   Get Single Categories
*   @route  GET /api/v1/categories/:id
*   @access Public
*/

export const getCategory = async (req,res) => {
    const {id} = req.params;
    const category = await Category.findById(id)
    if (!category) {
      throw new ErrorHandler("Category not found", 404);
    }

    res.status(200).json({
        success: true,
        message: "Category fetched successfully",
        category
    })
}

/**
 * @desc Update Category
 * @route PUT /api/v1/categories/:id/update
 * @access Private/Admin
*/
export const updateCategory = async (req, res) => {
    const convertedImage = req.file ? req.file.path : null;
    const { name } = req.body;

    const id = req.params.id;
    const category = await Category.findById(id);

    if(!category){
      throw new ErrorHandler("Category not found", 404);
    }

    let updatedCategory;

    if(convertedImage){
      await deleteImage(category.image);
      updatedCategory = await Category.findByIdAndUpdate(
        id,
        {
          name,
          image: convertedImage,
        },
        {
          new: true,
        }
      );
    } else {
      updatedCategory = await Category.findByIdAndUpdate(
        id,
        {
          name,
        },
        {
          new: true,
        }
      );
    }
    

   
   return res.status(200).json({
        success: true,
        message: "Category updated successfully",
        category: updatedCategory,
    })
}


/**
 * @desc Delete category
 * @route DELETE /api/v1/categories/:id/delete
 * @access Private/Admin
*/
export const deleteCategory = async (req, res) => {
    const id = req.params.id;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      throw new ErrorHandler("Category not found", 404);
    }

    await deleteImage(category.image)

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      category,
    });
}