import { redis } from "../config/redis.config.js";
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

    await updateActiveCategoriesCache();
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
    
    return res.status(200).json({
        success: true,
        message: "Categories fetched successfully",
        categories
    })
}

/**
*   @desc   Get all Categories
*   @route  GET /api/v1/categories
*   @access Public
*/

export const getFeaturedCategories = async (req,res) => {
    let featured_categories = await redis.get("featured_categories");
    if(featured_categories) {
       return res.status(200).json({
         success: true,
         message: "Categories fetched from cache",
         categories: JSON.parse(featured_categories)
       });
    }

     featured_categories = await Category.find({
       isActivated: true,
       isFeatured: true,
     });
    
     if(!featured_categories) {
      throw new ErrorHandler("No categories found", 404);
     }
    //.populate("user")
    await redis.set("featured_categories", JSON.stringify(featured_categories), "EX", 24 * 3600)
    return res.status(200).json({
        success: true,
        message: "Categories fetched successfully",
        categories: featured_categories
    })
}

/**
*   @desc   Get all Categories
*   @route  GET /api/v1/categories
*   @access Public
*/

export const getActiveCategories = async (req,res) => {
    let categories = await redis.get("active_categories");

    if(categories) {
      return res.status(200).json({
        success: true,
        message: "Categories fetched successfully",
        categories: JSON.parse(categories),
      });
    }

    categories = await Category.find({isActivated: true})

    if (!categories) {
      throw new ErrorHandler("No categories found", 404);
    }

    await redis.set(
      "active_categories",
      JSON.stringify(categories),
      "EX",
      24 * 3600
    );

    return res.status(200).json({
        success: true,
        message: "Categories fetched successfully",
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

    return res.status(200).json({
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
    
    if(updatedCategory.isFeatured){
      await updateFeaturedCategoriesCache();
    }
    await updateActiveCategoriesCache()
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

    if(category.isFeatured){
       await updateFeaturedCategoriesCache();
    }
   
    await updateActiveCategoriesCache();

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      category,
    });
}

/**
*   @desc   soft delete a category
*   @route  Patch /api/v1/categories/toggle-activated/:id
*   @access Private/Admin
*/
export const toggleActivated = async (req, res) => {
    const id = req.params.id;
    const category = await Category.findById(id);

    let updatedCategory;
    if(category) {
        await redis.del(`category:${id}`);
        category.isActivated = !category.isActivated;

        if(category.isFeatured) {
            category.isFeatured = false;
            updatedCategory = await category.save();
            await updateFeaturedCategoriesCache();
        }else{
            updatedCategory = await category.save();
        }
        
        await updateActiveCategoriesCache()
         return res.status(200).json({
           success: true,
           message: "Category activation status changed",
           category: updatedCategory,
         });
    }
    
    throw new ErrorHandler("category could not found", 404);
}

/**
*   @desc   toggle  featured status
*   @route  Patch /api/v1/categories/toggle-featured/:id
*   @access Private/Admin
*/
export const toggleFeatured = async (req,res) => {
    const id = req.params.id;
    const category = await Category.findById(id);


    if(category) {
        const featured_categories = await redis.get("featured_categories") ?  JSON.parse(
          await redis.get("featured_categories")
        ) : [];

        if(!category.isFeatured ) {
          if (category.products.length < 1) {
            throw new ErrorHandler("You cannot feature category without a product");
          }

          if (featured_categories.length >= 8) {
            throw new ErrorHandler("Maximum featured category of 8 reached");
          } 

          
        }
        

        category.isFeatured = !category.isFeatured;

        
        const updatedCategory = await category.save();

        await updateFeaturedCategoriesCache();
        await updateActiveCategoriesCache()
        return res.status(200).json({
            success: true,
            message: `${updatedCategory.name} is featured ${updatedCategory.isFeatured ? "yes":"no"}`,
            category: updatedCategory,
            
        })
    }

   throw new ErrorHandler("No Category found", 404);
}


export async function updateFeaturedCategoriesCache () {
    const featuredCategories = await Category.find({isFeatured: true}).lean();
    await redis.set("featured_categories", JSON.stringify(featuredCategories), "EX", 24 * 3600);
}

export async function updateActiveCategoriesCache () {
    const activeCategories = await Category.find({isActivated: true}).lean();
    await redis.set("active_categories", JSON.stringify(activeCategories), "EX", 24 * 3600);
}