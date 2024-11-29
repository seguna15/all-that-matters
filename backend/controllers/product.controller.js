import { redis } from "../config/redis.config.js";
import logger from "../logger/logger.js";
import Brand from "../models/brand.model.js";
import Category from "../models/category.model.js";
import Product from "../models/product.model.js"
import Unit from "../models/unit.model.js";
import {deleteImages} from "../utils/deleteImage.util.js";
import ErrorHandler from "../utils/ErrorHandler.util.js"


/**
*   @desc    Fetch all products
*   @route  POST /api/v1/products/
*   @access Private/Admin
*/
export const fetchAllProducts = async (req,res) => {
    const products = await Product.find()
    .populate('category', 'name')
    .populate('brand', 'name')
    .populate('unit', 'name')
    
    return res.status(200).json({
        success: true,
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
          success: true,
          message: "Product fetched successfully",
          product: JSON.parse(product),
        });
    }

    //get product from db instead
    product = await Product.findById(id).populate('category', 'name').populate('brand', 'name').populate("category", "name")
    .populate("brand", "name");;
    if(!product){
        throw new ErrorHandler("Product not found", 404);
    }

    //update cache
    await redis.set(`product:${product._id}`, JSON.stringify(product), "EX", 7 * 24 * 60 * 60);

    //return response
    return res.status(200).json({
        success: true,
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
    featuredProducts = await Product.find({isFeatured: true}).populate("category", "name")
    .populate("brand", "name").lean();

    if(!featuredProducts) {
        throw new ErrorHandler("No featured products found");
    }

    //store in redis for feature quick access

    await redis.set(
      "featured_products",
      JSON.stringify(featuredProducts),
      "EX",
      1 * 24 * 60 * 60
    ); 
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
  const { category } = req.params;
  let productQuery =  Product.find({ category, isActivated: true })
    .populate("category", "name")
    .populate("brand", "name");

  //filtering

  // filter by brand
  if (req.query.brand) {
    productQuery = productQuery.find({
      brand: { $eq: req.query.brand },
    });
  }


 
  //filter by price range
  if (req.query.price) {
    const priceRange = req.query.price.split("-");
    //greater than oe equal to and less than or equal to
    productQuery = productQuery.find({
      price: { $gte: priceRange[0], $lte: priceRange[1] },
    });
  }

  //filter by price range
  if (req.query.quantity) {
    const quantityRange = req.query.quantity.split("-");
    //greater than oe equal to and less than or equal to
    productQuery = productQuery.find({
      quantity: { $gte: quantityRange[0], $lte: quantityRange[1] },
    });
  }

  //pagination
  //page
  const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  //limit
  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
  //startIndex
  const startIndex = (page - 1) * limit;
  //endIndex
  const endIndex = page * limit;
  //total
  const total = await Product.countDocuments({ category, isActivated: true });

  productQuery = productQuery.skip(startIndex).limit(limit);

  //pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  //await query
  const products = await productQuery;

  return res.status(200).json({
    success: true,
    total,
    results: products.length,
    pagination,
    message: "Product fetched",
    products,
  });

  
}


/**
*   @desc   create product
*   @route  POST /api/v1/products/
*   @access Private/Admin
*/
export const createProduct = async (req, res) => {
  try {
    const convertedImages = req?.files?.map((file) => file.path);

    if (convertedImages.length < 1) {
      throw new ErrorHandler("Please upload at least one image", 400);
    }

    const { name, description, price, quantity, category, brand, unit } =
      req.body;

    const productExist = await Product.findOne({ name: name.toLowerCase() });

    if (productExist) {
      await deleteImages(convertedImages);
      throw new ErrorHandler("Product already exist", 409);
    }

    const categoryExist = await Category.findById(category);

    if (!categoryExist) {
      await deleteImages(convertedImages);
      throw new ErrorHandler("Category not found", 404);
    }

    const brandExist = await Brand.findById(brand);

    if (!brandExist) {
      await deleteImages(convertedImages);
      throw new ErrorHandler("Brand not found", 404);
    }

    const unitExist = await Unit.findById(unit);

    if (!unitExist) {
      await deleteImages(convertedImages);
      throw new ErrorHandler("Unit not found", 404);
    }

    const product = await Product.create({
      name,
      description,
      price,
      quantity,
      images: convertedImages,
      category,
      brand,
      unit,
    });

    if (!product) {
      await deleteImages(convertedImages);
      throw new ErrorHandler("Product not created", 400);
    }

    categoryExist.products.push(product._id);
    await categoryExist.save();

    brandExist.products.push(product._id);
    await brandExist.save();

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    logger.error(error)
    throw new ErrorHandler("Something went wrong", 404)
  }
    
}

/**
*   @desc   create product
*   @route  Patch /api/v1/products/
*   @access Private/Admin
*/
export const updateProduct = async (req, res) => {
  const id = req.params.id;

  const convertedImages =
    req?.files?.length > 0 ? req?.files?.map((file) => file?.path) : null;

  const { name, description, price, quantity, category, brand, unit } = req.body;

  const categoryExist = await Category.findById(category);

  if (!categoryExist) {
    await deleteImages(convertedImages);
    throw new ErrorHandler("Category not found", 404);
  }

  const brandExist = await Brand.findById(brand);

  if (!brandExist) {
    await deleteImages(convertedImages);
    throw new ErrorHandler("Brand not found", 404);
  }

  const unitExist = await Unit.findById(unit);

  if (!unitExist) {
    await deleteImages(convertedImages);
    throw new ErrorHandler("Unit not found", 404);
  }
  const product = await Product.findById(id);

  let updatedProduct;
  if (convertedImages) {
    await deleteImages(product.images);
    updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        quantity,
        category,
        brand,
        unit,
        images: convertedImages,
      },
      { new: true }
    ).populate("category", "name").populate("brand", "name");
  } else {
    updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        quantity,
        category,
        brand,
        unit,
      },
      { new: true }
    )
      .populate("category", "name")
      .populate("brand", "name");
  }

  //remove product from category if category changes
  if (category !== product.category.toString()) {
    const formerCategory = await Category.findById(product.category);
    const newProductArray = formerCategory.products.filter(
      (item) => item.toString() !== updatedProduct._id.toString()
    );
    formerCategory.products = newProductArray;
    await formerCategory.save();
    categoryExist.products.push(product._id);
    await categoryExist.save();
  }

  //remove product from brand if brand changes
  if (brand !== product.brand.toString()) {
    const formerBrand = await Brand.findById(product.brand);
    const newProductArray = formerBrand.products.filter(
      (item) => item.toString() !== updatedProduct._id.toString()
    );
    formerBrand.products = newProductArray;
    await formerBrand.save();
    brandExist.products.push(product._id);
    await brandExist.save();
  }

  const cachedProduct = await redis.get(`product:${id}`);

  if (cachedProduct) {
    await redis.set(
      `product:${id}`,
      JSON.stringify(updatedProduct),
      "EX",
      7 * 24 * 60 * 60
    );
  }
  await updateFeaturedProductsCache()
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
    const categoryProductsList = category.products.filter(
    (item) => item.toString() !== product._id.toString()
    );
    category.products = categoryProductsList;
    await category.save();

    const brand = await Brand.findById(product.brand);
    const brandProductsList = brand.products.filter(
      (item) => item.toString() !== product._id.toString()
    );
    brand.products = brandProductsList;
    await brand.save();

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
            $sample: {size: 4}
        },{
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                images: 1,
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
export const toggleFeatured = async (req,res) => {
    const id = req.params.id;
    const product = await Product.findById(id);


    if(product) {
        const featured_products =  JSON.parse(
          await redis.get("featured_products")
        );

        if(!product.isFeatured ) {
          if (product.quantity < 1) {
            throw new ErrorHandler("You cannot feature out of stock product");
          }

          if (featured_products.length >= 8) {
            throw new ErrorHandler("Maximum featured product of 8 reached");
          } 

          
        }
        

        product.isFeatured = !product.isFeatured;

        
        const updatedProduct = await product.save();

        await updateFeaturedProductsCache();
        return res.status(200).json({
            success: true,
            message: `${updatedProduct.name} is featured ${updatedProduct.isFeatured ? "yes":"no"}`,
            product: updatedProduct,
            
        })
    }

   throw new ErrorHandler("No Product found", 404);
}

export async function updateFeaturedProductsCache () {
    const featuredProducts = await Product.find({isFeatured: true}).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts), "EX", 24 * 3600);
}
