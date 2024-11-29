import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

/**
 *   @desc    fetch analytics
 *   @route  POST /api/v1/analytics/
 *   @access Private/Admin
 */
export const getAnalytics = async (req, res) => {
    const analyticsData = await getAnalyticsData();
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    const dailySalesData = await getDailySalesData(startDate, endDate);

    return res.status(200).json({
        success: true,
        analyticsData,
        dailySalesData
    })
};

const getAnalyticsData = async () => {
  const totalUsers = await User.countDocuments({ isAdmin: false });
  const totalProducts = await Product.countDocuments();
  const salesData = await Order.aggregate([
    {
        $group: {
            _id: null, //group all documents together
            totalSales: {$sum:1}, //sum all the total orders in the DB
            totalRevenue: {$sum:"$totalAmount"}
        }
    }
  ]);

  const {totalSales, totalRevenue} = salesData[0] || {totalSales: 0, totalRevenue: 0};

  return {
    users: totalUsers,
    products: totalProducts,
    totalSales,
    totalRevenue
  }
};


const getDailySalesData =  async (startDate, endDate) => {
  const dailySalesData = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        sales: { $sum: 1 },
        revenue: { $sum: "$totalAmount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  /* examples of daily sales data 
    [
        {
            _id: "2024-08-18",
            sales: 12,
            revenue: 1450.75
        }
    ] */

  const dateArray = getDatesInRange(startDate, endDate); // ["2024-08-18","2024-08-19", ....]

  return dateArray?.map(date => {
    const foundData = dailySalesData.find(item => item._id === date);
    return {
      date,
      sales: foundData?.sales || 0,
      revenue: parseFloat(foundData?.revenue.toFixed(2)) || 0,
    };
  })

  
}

const getDatesInRange = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate)

    while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split("T")[0])
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}