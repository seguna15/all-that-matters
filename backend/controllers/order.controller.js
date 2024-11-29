import { redis } from "../config/redis.config.js";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import ErrorHandler from "../utils/ErrorHandler.util.js";
import https from "https"
import crypto from "crypto"
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import { updateFeaturedProductsCache } from "./product.controller.js";
import { sendInvoice } from "../mail/email.js";



const secret = process.env.PAYSTACK_SECRET;
/**
*   @desc    Create order
*   @route  POST /api/v1/orders/create-checkout-session
*   @access Private/User
*/
export const createCheckoutSession = async (req, res) => {

  const {
    amount,
    subTotal,
    saving,
    couponCode,
    discountPercentage,
    cartItems,
    shippingAddress, 
    useAsShippingAddress,
  } = req.body;



   if (cartItems.length < 1) {
     throw new ErrorHandler("Please add items to your cart", 400);
   }
    const userFound = await User.findById(req?.userAuthId);

    if(!userFound) {
        throw new ErrorHandler('User not found', 403);
    }

    if(useAsShippingAddress) {
      userFound.shippingAddress = shippingAddress;
      userFound.hasShippingAddress = true;
      const savedUser = await userFound.save();
       
      if(!savedUser){
        throw new ErrorHandler("Fill Shipping address form", 400)
      }
    }



    const convertedOrderItems = cartItems?.map(item => {
        return {
             _id: item?._id,   price: item?.price?.toFixed(2), boughtQty: item.boughtQty
        }
    });
    
    await redis.set(`cart:${userFound._id}`, JSON.stringify(convertedOrderItems))

    const code = amount === subTotal ? null : couponCode;
    const percentage = amount === subTotal ? 0 : discountPercentage;
    try {
        const params = JSON.stringify({
          email: userFound?.email,
          amount: amount * 100,
          currency: "NGN",
          metadata: {
            userId: userFound._id,
            couponCode: code,
            discountPercentage: percentage,
            saving,
            subTotal,
            shippingAddress,
            cancel_action:
              `${process.env.CLIENT_URL}/payment-canceled`,
          },
        });

        const options = {
          hostname: "api.paystack.co",
          port: 443,
          path: "/transaction/initialize",
          method: "POST",
          headers: {
            Authorization: `Bearer ${secret}`,
            "Content-Type": "application/json",
          },
        };

        //making request to paystack's api
        const clientRequest = https
          .request(options, (apiResponse) => {
            let data = "";

            apiResponse.on("data", (chunk) => {
              data += chunk;
            });

            apiResponse.on("end", () => {
              //console.log(JSON.parse(data));
              return res.status(200).json(JSON.parse(data));
            });
          })
          .on("error", (error) => {
            console.error(error);
          });

        clientRequest.write(params);
        clientRequest.end();
    } catch (error) {
        console.log(error);
        throw new ErrorHandler(500)
    } 
    
}

export const paymentSuccess = async (req, res) => {
    return res.status(200).redirect(`${process.env.CLIENT_URL}/payment-success`)
    
}

export const paymentCancel = async (req, res) => {
   return res.status(200).redirect(`${process.env.CLIENT_URL}/payment-canceled`);
}


/**
 * Verify paystack transaction
 */
export const verifyPaystackTransaction = (req, res) => {
  try {
    const reference = req.body.reference;

    const options = {
      hostname: "api.paystack.co",
      port: 443,
      path: `/transaction/verify/:${reference}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${secret}`,
      },
    };

    const clientReqest = https
      .request(options, (apiResponse) => {
        let data = "";

        apiResponse.on("data", (chunk) => {
          data += chunk;
        });

        apiResponse.on("end", () => {
          console.log(JSON.parse(data));
          return res.status(200).json(JSON.parse(data))
        });
      })
      .on("error", (error) => {
        console.error(error);
      });
  } catch (error) {
    
  }
};

/**
*   @desc    Get all orders 
*   @route  GET /api/v1/orders/
*   @access Private/Admin
*/
export const getAllOrders = async (req, res) => {
  const orders = await Order.find().populate("user", "email").sort({createdAt: -1});

  return res.status(200).json({
    success: true,
    message: "Orders fetched successfully",
    orders,
  })
}

/**
*   @desc    Get all customer orders 
*   @route  GET /api/v1/orders/customer
*   @access Private/Admin
*/
export const getAllCustomerOrders = async (req, res) => {
  const customer = req.userAuthId
  const orders = await Order.find({user:customer}).populate("user", "email").sort({createdAt: -1});

  return res.status(200).json({
    success: true,
    message: "Orders fetched successfully",
    orders,
  })
}


/**
*   @desc    Update order status 
*   @route  POST /api/v1/orders/update-payment-status/:id
*   @access Private/Admin
*/
export const updatePaymentStatus = async (req, res) => {
    /* try {
        const {sessionId} = req.body;
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if(session.payment_status === "paid") {
            if(session.metadata.couponCode){
                await Coupon.findOneAndDelete({
                  code: session.metadata.couponCode,
                  userId: session.metadata.userId,
                }, {
                    isActive: false,
                });
            }
            
            //create a new Order 
            const products = JSON.parse(session.metadata.products);
            const newOrder = new Order({
                user: session.metadata.userId,
                products: products.map(product => ({
                    product: product.id,
                    quantity: product.quantity,
                    price: product.price
                })),
                totalAmount: session.amount_total / 100, // convert from cents to dollar
                stripeSessionId: sessionId
            })

            await newOrder.save();


            //reduce product quantity and increase item  sold and also update redis cache
            //find all product in our order in db
            const dbProducts = await Product.find({ id: { $in: products } });

            //map through stripe order
            products?.map(async (order) => {
                //find product in db where _id == stripe order item id
              const product = dbProducts?.find((product) => {
                return product?._id?.toString() === order?.id?.toString();
              });

              //update quantity sold and product quantity
              if (product) {
                product.totalSold += order.quantity;
                product.quantity -= order.quantity;
              }

              await product.save();
            });
            
            //clear cart
            await redis.del(`cart:${session.metadata.userId}`);
            
            return res.status(200).json({
                success: true,
                message: "Payment successful, order created, and coupon deactivated if used.",
                orderId: newOrder._id,
            });
        }
    } catch (error) {
        console.log(error);
        throw new Error("Oops server error", 500);
    } */
} 


/**
*   @desc    Fetch order by Id 
*   @route  PUT /api/v1/orders/update-shipping-status/:id
*   @access Private/Admin
*/
export const getOrder = async (req, res) => {
  const id = req.params.id;

  
  const order = await Order.findById(id)
  .populate({
        path: "orderItems",
        populate: {
          path: "_id",
          select: "images name",
        },
      });
  
  if(!order) {
    throw new ErrorHandler("Order not found");
  }

  return res.status(200).json({
    success: true,
    message: `Order fetched successfully`,
    order,
  })
}

/**
*   @desc    Update order status 
*   @route  PUT /api/v1/orders/update-shipping-status/:id
*   @access Private/Admin
*/
export const updateShippingStatus = async (req, res) => {
  const id = req.params.id;

  const {orderStatus} = req.body;

  const updatedOrder = await Order.findByIdAndUpdate(id, {
    orderStatus
  }, {new: true}).populate("user", "email")

  if(!updatedOrder) {
    throw new ErrorHandler("Order not found");
  }

  return res.status(200).json({
    success: true,
    message: `Order ${updatedOrder?.paymentSessionID} updated to ${updatedOrder.orderStatus}`,
    order: updatedOrder,
  })
}

async function createStripeCoupon(discountPercentage) {
    const coupon = await stripe.coupons.create({
        percent_off: discountPercentage,
        duration: "once",
    });

    return coupon.id;
}

// create session if users bought more than $200
async function createNewCoupon (userId) {
    const newCoupon = new Coupon({
        code: "GIFT" + Math.random().toString(36).substring(2,8).toUpperCase(),
        discountPercentage: 10,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        userId: userId,
    })

    await newCoupon.save();
    return newCoupon;
}

//create order 



//endpoint to listen to paystack's webhook event
export const  paystackWebHook = async (req, res) => {

    //validate event
    const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
    if (hash == req.headers['x-paystack-signature']) {
        // Retrieve the request's body
        const session = req.body;
        // Do something with event  
        
        if(session?.event == "charge.success"){
            const data = session?.data
           
            const user = data?.metadata?.userId; 
            const subTotal = data?.metadata?.subTotal;
            const totalAmount = (data?.amount/100)?.toFixed(2)
            const couponCode = data?.metadata?.couponCode || null;
            const discountPercentage = data?.metadata?.discountPercentage || 0;
            const shippingAddress = data?.metadata?.shippingAddress;
            const saving = data?.metadata?.saving;
            const paymentStatus = "paid";
            const orderStatus = "processing";
            const paymentSessionID = data?.reference;
            const paymentProvider = "paystack";
            const paymentMethod = data?.channel;
            const email = data?.customer?.email;

            const orderItems = JSON.parse(await redis.get(`cart:${user}`))

            const order = await Order.create({
                user,
                orderItems,
                totalAmount,
                subTotal,
                saving,
                shippingAddress,
                coupon: {
                    code: couponCode,
                    percentage: discountPercentage,
                },
                paymentStatus,
                paymentProvider,
                paymentMethod,
                paymentSessionID,
                orderStatus,
            });

            await User.findByIdAndUpdate(user, {
              $push: {orders: order._id}
            })

             const products = await Product.find({ _id: { $in: orderItems } });
             
             orderItems?.map(async (order) => {
                const product = products?.find((product) => {
                    return product?._id?.toString() === order?._id?.toString();
                });

                if (product) {
                        product.quantity -= order.boughtQty
                        product.totalSold += order.boughtQty;
                }

               const saveProduct = await product.save();

               await redis.del(
                 `product:${saveProduct?._id}`,
               );
             }); 

             if(couponCode !== null){
                const coupon = await Coupon.findOne({
                    code: couponCode,
                });

                if(coupon.maxUsage - coupon.usageCount === 1) {
                  coupon.isActive = false;
                }
                coupon.usageCount += 1;
                await coupon.save()
             }

             await redis.del(`cart:${user}`)
             await updateFeaturedProductsCache();

            const orderData = await  order.populate({
                path: "orderItems",
                populate: {
                  path: "_id",
                  select: "images name",
                },
              });
              await sendInvoice(orderData, email); 
             return res.status(200).end();
        }
    }

    return res.status(200).end();

}

