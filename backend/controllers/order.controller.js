import { redis } from "../config/redis.config.js";
import { stripe } from "../config/stripe.config.js";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import ErrorHandler from "../utils/ErrorHandler.util.js";

/**
*   @desc    Create order
*   @route  POST /api/v1/orders/create-checkout-session
*   @access Private/User
*/
export const createCheckoutSession = async (req, res) => {
    try {
        const {products, couponCode} = req.body;

        if(!Array.isArray(products) || products.length === 0){
            throw new ErrorHandler("Invalid or empty product items", 400)
        }

        let totalAmount = 0;
        //converting to stripe data
        const lineItems = products.map((product) => {
            const amount = (product.price * 100) // stripe wants in cents
            totalAmount += amount * product.quantity

            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: product.name,
                        name: [product.image],
                    },
                    unit_amount: amount
                }
            }
        })

        let coupon = null;

        if(couponCode) {
            coupon = await Coupon({code: couponCode, isActive: true});
            if(coupon){
                totalAmount -= (totalAmount * (coupon.discountPercentage/100))
            }
        }

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: lineItems,
          mode: "payment",
          success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
          discounts: coupon ? [
            {
                coupon: await createStripeCoupon(coupon.discountPercentage),
            },
          ]: [],
          metadata: {
            userId: req.userAuthId.toString(),
            couponCode: couponCode || "",
            products: JSON.stringify(
                products.map((p) => ({
                    id: p._id,
                    quantity: p.quantity,
                    price: p.price,
                }))
            ),
          },
        });

        //create new coupon if the person is buying 200 and more
        if(totalAmount >= 200000){
            await createNewCoupon(req.userAuthId)
        }

        return res.status(200).json({id:session.id, totalAmount: totalAmount/100})
    } catch (error) {
        console.log(error)
        throw new Error("Oops server error", 500)
    }
}


/**
*   @desc    Update order status 
*   @route  POST /api/v1/orders/update-payment-status/:id
*   @access Private/Admin
*/
export const updatePaymentStatus = async (req, res) => {
    try {
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
    }
}



/**
*   @desc    Update order status 
*   @route  POST /api/v1/orders/update-shipping-status/:id
*   @access Private/Admin
*/
export const updateShippingStatus = async (req, res) => {

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