import { redis } from "../config/redis.config.js";
import Product from "../models/product.model.js"
import ErrorHandler from "../utils/ErrorHandler.util.js"
import fs from "fs";

/**
*   @desc    Fetch all products
*   @route  POST /api/v1/products/
*   @access Private/Admin
*/
export const fetchAllProducts = async (req,res, next) => {
    const products = await Product.find({});
    res.status(200).json({
        status: true,
        message: "Product fetched successfully",
        products
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
        return res.status(404).json({
            success: false,
            message: "No featured products found",
        })
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
export const createProduct = async (req, res, next) => {
    const convertedImages = req.files.map((file) => file.path);
    const {name, description, price, quantity} = req.body;

    const product = await Product.create({
        name,
        description,
        price,
        quantity,
        images: convertedImages,
    })

    if(!product) {
        return res.status(400).json({
            success: false,
            message: "Oops we could not create products"
        })
    }

    return res.status(201).json({
        success: true,
        message: "Product created successfully",
        product
    })
}



/**
*   @desc   delete a product
*   @route  Delete /api/v1/products/
*   @access Private/Admin
*/
export const deleteProduct = async (req, res, next) => {
    const id = req.params.id;
    const product = await Product.findById(id);

    if(product.images){
        product.images.forEach(image => {
            fs.unlinkSync(image, (err) => {
                console.log(err)
                next(new ErrorHandler("Image could not be deleted"))
            })
        })
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    return res.status(200).json({
        success: true,
        message: "Deleted successfully",
        product: deletedProduct
    })
    
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
export const toggleFeature = async (req,res, next) => {
    const id = req.params.id;
    const product = await Product.findById(id);
    if(product) {
        product.isFeatured = !product.isFeatured;
        const updatedProduct = await product.save();

        await updateFeaturedProductsCache();
    }

    next (new ErrorHandler("No Product found", 404));
}

async function updateFeaturedProductsCache () {
    const featuredProducts = await Product.find({isFeatured: true}).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
}
