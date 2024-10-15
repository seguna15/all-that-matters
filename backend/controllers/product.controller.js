import { redis } from "../config/redis.config.js";
import Category from "../models/category.model.js";
import Product from "../models/product.model.js"
import {deleteImages} from "../utils/deleteImage.util.js";
import ErrorHandler from "../utils/ErrorHandler.util.js"


/**
*   @desc    Fetch all products
*   @route  POST /api/v1/products/
*   @access Private/Admin
*/
export const fetchAllProducts = async (req,res) => {
    const products = await Product.find();
    return res.status(200).json({
        status: true,
        message: "Product fetched successfully",
        products
    })
}

/**
*   @desc    Fetch  product by Id
*   @route  POST /api/v1/products/:id
*   @access Private/Admin
*/
export const fetchProduct = async (req,res) => {
    const id = req.params.id;

    //get product from redis cache
    let product = await redis.get(`product:${id}`)
    if(product){
        return res.status(200).json({
          status: true,
          message: "Product fetched successfully",
          product: JSON.parse(product),
        });
    }

    //get product from db instead
    product = await Product.findById(id);
    if(!product){
        throw new ErrorHandler("Product not found", 404);
    }

    //update cache
    await redis.set(`product:${product._id}`, JSON.stringify(product), "EX", 7 * 24 * 60 * 60);

    //return response
    return res.status(200).json({
        status: true,
        message: "Product fetched successfully",
        product
    })
}

/**
*   @desc   Fetch featured products
*   @route  GET /api/v1/products/featured-products
*   @access Public
*/
export const fetchFeaturedProducts = async (req, res) => {
    let featuredProducts = await redis.get("featured_products")
    if(featuredProducts){
        return res.status(200).json({
            success: true,
            message: "Featured products fetched successfully",
            products: JSON.parse(featuredProducts)
        });
    }
    //if not in redis fetch from mongodb, lean returns a plain mongodb object
    featuredProducts = await Product.find({isFeatured: true}).lean();

    if(!featuredProducts) {
        throw new ErrorHandler("No featured products found");
    }

    //store in redis for feature quick access

    await redis.set("featured_products", JSON.stringify(featuredProducts));
    return res.status(200).json({
       success: true,
       message: "Featured products fetched successfully",
       products: featuredProducts,
    });

}


/**
*   @desc   Fetch  products by category
*   @route  GET /api/v1/products/featured-products
*   @access Public
*/
export const getProductsByCategory = async (req, res) => {
    
    const {category} = req.params;
    const products = await Product.find({category});
    //filtering


    return res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        products
    })

}


/**
*   @desc   create product
*   @route  POST /api/v1/products/
*   @access Private/Admin
*/
export const createProduct = async (req, res) => {
    const convertedImages = req.files.map((file) => file.path);

    if(convertedImages.length < 1) {
        throw new ErrorHandler("Please upload at least one image", 400)
    }

    const {name, description, price, quantity, category} = req.body;
    
    const productExist  = await Product.findOne({name: name.toLowerCase()});

    if(productExist){
        await deleteImages(convertedImages)
        throw new ErrorHandler("Product already exist", 409);
    }

    const categoryExist = await Category.findById(category) 

    if(!categoryExist){
        await deleteImages(convertedImages);
        throw new ErrorHandler("Category not found", 404);
    }

    const product = await Product.create({
        name,
        description,
        price,
        quantity,
        images: convertedImages,
        category
    })

    if(!product) {
        await deleteImages(convertedImages);
        throw new ErrorHandler("Product not created", 400)
    }


    categoryExist.products.push(product._id);
    await categoryExist.save();

    return res.status(201).json({
        success: true,
        message: "Product created successfully",
        product
    })
}

/**
*   @desc   create product
*   @route  Patch /api/v1/products/
*   @access Private/Admin
*/
export const updateProduct = async (req, res) => {
    const id = req.params.id;
    
    const convertedImages = req?.files?.length > 0 ? req?.files?.map((file) => file?.path) : null;
  
    const {name, description, price, quantity, category} = req.body;

    const categoryExist = await Category.findById(category);
   
    if(!categoryExist){
        await deleteImages(convertedImages);
        throw new ErrorHandler("Category not found", 404);
    }
    const product = await Product.findById(id);
    
    let updatedProduct;
    if(convertedImages) {
        await deleteImages(product.images);
        updatedProduct = await Product.findByIdAndUpdate(
          id,
          {
            name,
            description,
            price,
            quantity,
            category,
            images: convertedImages,
          },
          { new: true }
        );
    }else{
         updatedProduct = await Product.findByIdAndUpdate(
           id,
           {
             name,
             description,
             price,
             quantity,
             category,
           },
           { new: true }
         );
    }
  
    //remove from  old category 
    
    if (category !== product.category.toString()){
        console.log("I am here");
        const formerCategory = await Category.findById(product.category);
        const newProductArray = formerCategory.products.filter((item) => item.toString() !== updatedProduct._id.toString());
        formerCategory.products = newProductArray;
        await formerCategory.save();
        categoryExist.products.push(product._id);
        await categoryExist.save();
    }
      

    const cachedProduct = await redis.get(`product:${id}`)

    if(cachedProduct){
        await redis.set(`product:${id}`, JSON.stringify(updatedProduct));
    } 

    return res.status(201).json({
    success: true,
    message: "Product updated successfully",
    product: updatedProduct,
    });
}

/**
*   @desc   delete a product
*   @route  Delete /api/v1/products/
*   @access Private/Admin
*/
export const deleteProduct = async (req, res) => {
    const id = req.params.id;
    const product = await Product.findById(id);

    if(!product) {
        throw new ErrorHandler("Product not found", 400)
    }

    /* if(product.quantity > 0) {
        throw new ErrorHandler("You cannot delete a product with active units", 400)
    } */

    
    const deletedProduct = await Product.findByIdAndDelete(id);

    if(!deletedProduct) {
        throw new ErrorHandler("product could not be deleted")
    }

    await redis.del(`product:${id}`);
    await deleteImages(product?.images);
    const category = await Category.findById(product.category);
    const newProductArray = category.products.filter(
    (item) => item.toString() !== product._id.toString()
    );
    category.products = newProductArray;
    await category.save();

    await updateFeaturedProductsCache()
    
    return res.status(200).json({
        success: true,
        message: "Deleted successfully",
        product: deletedProduct
    })
    
}

/**
*   @desc   soft delete a product
*   @route  Patch /api/v1/products/toggle-activated
*   @access Private/Admin
*/
export const toggleActivated = async (req, res) => {
    const id = req.params.id;
    const product = await Product.findById(id);

    let updatedProduct;
    if(product) {
        await redis.del(`product:${id}`);
        product.isActivated = !product.isActivated;
        if(product.isFeatured) {
            product.isFeatured = false;
            updatedProduct = await product.save();
            await updateFeaturedProductsCache();
        }else{
            updatedProduct = await product.save();
        }
        
         return res.status(200).json({
           success: true,
           message: "Product activation status changed",
           product: updatedProduct,
         });
    }
    
    throw new ErrorHandler("product could not found", 404);
}


/**
*   @desc   recommend product
*   @route  get /api/v1/products/get-recommended-products
*   @access Public
*/
export const getRecommendedProducts = async (req, res, next) => {
    const products = await Product.aggregate([
        {
            $sample: {size: 3}
        },{
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                image: 1,
                price: 1
            }
        }
    ]);

    return res.status(200).json({
        success: true,
        message: "Recommended products fetched",
        products,
    })
}

/**
*   @desc   delete a product
*   @route  Patch /api/v1/products/toggle-featured
*   @access Private/Admin
*/
export const toggleFeatured = async (req,res, next) => {
    const id = req.params.id;
    const product = await Product.findById(id);
    if(product) {
        product.isFeatured = !product.isFeatured;
        const updatedProduct = await product.save();

        await updateFeaturedProductsCache();
        return res.status(200).json({
            success: true,
            message: false,
            product: updatedProduct
        })
    }

   throw new ErrorHandler("No Product found", 404);
}

async function updateFeaturedProductsCache () {
    const featuredProducts = await Product.find({isFeatured: true}).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
}
