import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye, Edit } from "lucide-react";
import { useOrdersStore } from "../../../../../store/ordersStore";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { orderStatus } from "../../../../../shared/data/data";
import { option } from "framer-motion/client";


const OrdersTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
  const { filteredOrders, filterOrder, updateOrderShippingStatus } =
    useOrdersStore();
	
  
	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterOrder(term);
	};

  const handleOnChange = async (orderStatus, orderId) => {
    if(orderStatus === ""){
      toast.error("Please select a status");
      return
    }
    await updateOrderShippingStatus(orderStatus, orderId);
  }

	return (
    <motion.div
      className="p-6 bg-gray-800 bg-opacity-50 border border-gray-700 shadow-lg backdrop-blur-md rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Order List</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search orders..."
            className="py-2 pl-10 pr-4 text-white placeholder-gray-400 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                Order ID
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                Customer Email
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                Total
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                Payment
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-gray-700 divide">
            {filteredOrders?.map((order) => (
              <motion.tr
                key={order._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-100 whitespace-nowrap">
                  {order?.paymentSessionID}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-100 whitespace-nowrap">
                  {order?.user?.email}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-100 whitespace-nowrap">
                  &#8358;{order?.subTotal?.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order?.paymentStatus === "paid"
                        ? "bg-green-100 text-green-800"
                        : order?.paymentStatus === "unpaid"
                        ? "bg-yellow-100 text-yellow-800"
                        : order?.paymentStatus === "shipped"
                    }`}
                  >
                    {order?.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">
                  <select
                    className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={order?.orderStatus}
                    onChange={(e) => handleOnChange(e.target.value, order?._id)}
                  >
                    <option value="">update status</option>
                    {orderStatus.map((status) => (
                      <option value={status.value}>{status.label}</option>
                    ))}
                    
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">
                  {new Date(order?.createdAt)?.toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">
                  <Link
                    to={`/admin/order-detail/${order?._id}`}
                    className="mr-2 text-indigo-400 hover:text-indigo-300"
                  >
                    <Eye size={18} />
                  </Link>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
export default OrdersTable;
