import { redis } from "../config/redis.config.js";
import Product from "../models/product.model.js";
import ErrorHandler from "../utils/ErrorHandler.util.js";
import { setUserCart } from "../utils/redis.util.js";

// cart will use redis cache entirely
/**
 *   @desc   Add product to cart
 *   @route  POST /api/v1/carts/
 *   @access Private
 */
export const addToCart = async (req, res) => {
    const {productId} = req.body;
    const id = req.userAuthId.toString();
    
    let cartItems = await redis.get(`cart:${id}`) ? JSON.parse(await redis.get(`cart:${id}`)) : []
    if(cartItems.length > 0){
        let existingItem = cartItems.find(
          (item) => item._id === productId
        );

        if (existingItem) {
            existingItem.boughtQty += 1;
        } else {
            cartItems.push({ _id: productId, boughtQty: 1 });
        }

    }else{
        cartItems.push({ _id: productId, boughtQty: 1 });
    }
    
 
    //save to redis
    await setUserCart(id, cartItems)
    return res.status(200).json({
        success: true,
        message: "Item added to cart",
        cart: cartItems,
    })
};

/**
 *   @desc   Add product to cart
 *   @route  GET /api/v1/carts/
 *   @access Private
 */
export const fetchCartItems = async (req, res, ) => {
    const id = req.userAuthId.toString();
    const cartItems = await redis.get(`cart:${id}`) ? JSON.parse(await redis.get(`cart:${id}`)) : [];
    
    if(cartItems.length > 0){
          //const products = await Product.find({ _id: { $in: orderItems } });

        const products = await Product.find({ _id : {$in: cartItems } });
      
        const convertedCartItems = products.map(product => {
            const cartItem = cartItems.find(item => item._id.toString() === product._id.toString());
            
            return { ...product.toJSON(), quantity: cartItem.boughtQty };
        }) 
        return res.status(200).json({
          success: true,
          message: "Item added to cart",
          cart: convertedCartItems,
        });
    }
    
    return res.status(200).json({
      success: true,
      message: "Item added to cart",
      cart: cartItems,
    });
};

/**
 *   @desc   update product quantity in cart
 *   @route  PATCH /api/v1/carts/
 *   @access Private
 */
export const updateItemQty = async (req, res ) => {
    const id = req.userAuthId.toString();

    const productId = req.params.productId;
    const { quantity } = req.body;
    
     const cartItems = JSON.parse(await redis.get(`cart:${id}`));
     
     const existingItem = cartItems.find((item) => item._id === productId);
    
    if(existingItem) {
        if(quantity === 0) {
            const filteredCart = cartItems.filter((item) => item._id !== productId);
            await setUserCart(id, filteredCart);
            return res.status(200).json({
              success: true,
              message: "Item added to cart",
              cart: filteredCart,
            });
        }

        existingItem.boughtQty = parseInt(quantity);
         await setUserCart(id, cartItems);
         return res.status(200).json({
           success: true,
           message: "Item added to cart",
           cart: cartItems,
         });
    }else {
        throw new ErrorHandler("Product not found", 404)
    }
};


/**
 *   @desc   Remove product from or clear 
 *   @route  DELETE /api/v1/carts/
 *   @access Private
 */
export const removeItemFromCart = async (req, res, ) => {
  const id = req.userAuthId.toString();
  const { productId } = req.body;

  if (!productId) {
    await redis.del(`cart:${id}`);
  } else {
    const cartItems = JSON.parse(await redis.get(`cart:${id}`));

    const filteredCart = cartItems.filter(
      (item) => item._id !== productId
    );
    await setUserCart(id, filteredCart);
  }

  return res.status(201).json({
    success: true,
    message: "Cart cleared successfully",
  });
};
