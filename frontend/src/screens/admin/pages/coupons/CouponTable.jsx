import { motion } from "framer-motion";
import { Edit, Eye, Search, Trash2 } from "lucide-react";
import {  useState } from "react";
import { Link } from "react-router-dom";
import { Spinner } from "../../../../components";
import { useCouponsStore } from "../../../../store/couponsStore";


const CouponsTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
  const { filteredCoupons, toggleActivation, deleteCoupon, couponLoading, filterCoupon } = useCouponsStore();

	const handleSearch = async (e) => {
		const term = e.target.value.toLowerCase();
    setSearchTerm(term);
		filterCoupon(term)
	}; 

  const handleDelete = async (id) => {
    await deleteCoupon(id);
  }

	return (
    <motion.div
      className="p-6 mb-8 bg-gray-800 bg-opacity-50 border border-gray-700 shadow-lg backdrop-blur-md rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex flex-col items-center justify-between gap-2 mb-6 md:flex-row ">
        <h2 className="text-xl font-semibold text-gray-100">
          Coupons List{`[${filteredCoupons?.length}]`}
        </h2>
        <Link
          to={"/admin/add-coupon"}
          className="px-4 py-1.5 font-bold text-sm text-white transition duration-200 rounded-lg shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 focus:scale-105"
        >
          Add Coupon
        </Link>
        <div className="relative">
          <input
            type="text"
            placeholder="Search coupons..."
            className="py-2 pl-10 pr-4 text-white placeholder-gray-400 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        {couponLoading === true ? (
          <Spinner />
        ) : (
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                  Code
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                  Discount (%)
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                  Max Usage
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                  Usage Count
                </th>

                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                  Expiration Date
                </th>

                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredCoupons?.map((coupon) => (
                <motion.tr
                  key={coupon?._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="flex items-center gap-2 px-6 py-4 text-sm font-medium text-gray-100 capitalize whitespace-nowrap">
                    {coupon?.code}
                  </td>
                  
                  <td className="px-6 py-4 text-sm text-gray-300 capitalize whitespace-nowrap">
                    {coupon?.discountPercentage}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-300 capitalize whitespace-nowrap">
                    {coupon?.maxUsage}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300 capitalize whitespace-nowrap">
                    {coupon?.usageCount}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">
                    {new Date(coupon?.expirationDate).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">
                    {coupon?.isActive === true ? (
                      <span
                        className="text-sm text-green-400"
                        onClick={() => toggleActivation(coupon?._id)}
                      >
                        Yes
                      </span>
                    ) : (
                      <span
                        className="text-sm text-red-400"
                        onClick={() => toggleActivation(coupon?._id)}
                      >
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">
                    <Link
                      key="fhjdf"
                      className="inline-flex mr-2 text-green-400 hover:text-green-300"
                    >
                      <Eye size={18} />
                    </Link>
                    <Link
                      to={`/admin/edit-coupon/${coupon?._id}`}
                      key="fiuwei"
                      className="inline-flex mr-2 text-indigo-400 hover:text-indigo-300"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(coupon?._id)}
                      key="sasp"
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
};
export default CouponsTable;