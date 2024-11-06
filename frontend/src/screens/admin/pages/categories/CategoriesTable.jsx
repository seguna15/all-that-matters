import { motion } from "framer-motion";
import { Edit, Eye, Search, Trash2 } from "lucide-react";
import {  useState } from "react";
import { Link } from "react-router-dom";
import { useCategoriesStore } from "../../../../store/categoriesStore";
import { Spinner } from "../../../../components";
import { serverURL } from "../../../../api";


const CategoriesTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
  const { filteredCategories, isLoading, /*toggleFeatured,*/ filterCategory } = useCategoriesStore();


	const handleSearch = async (e) => {
		const term = e.target.value.toLowerCase();
    setSearchTerm(term);
		filterCategory(term);
	}; 

 

  

	return (
    <motion.div
      className="p-6 mb-8 bg-gray-800 bg-opacity-50 border border-gray-700 shadow-lg backdrop-blur-md rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex flex-col items-center justify-between mb-6 md:flex-row">
        <h2 className="text-xl font-semibold text-gray-100">
          Categories List{`[${filteredCategories.length}]`}
        </h2>
        <Link
          to={"/admin/add-category"}
          className="px-3 py-1.5 text-sm font-bold text-white transition duration-200 rounded-lg shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 focus:scale-105"
        >
          Add Category
        </Link>
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="py-2 pl-10 pr-4 text-white placeholder-gray-400 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        {isLoading === true ? (
          <Spinner />
        ) : (
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                  Category Items
                </th>

                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredCategories?.map((category) => (
                <motion.tr
                  key={category?._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="flex items-center gap-2 px-6 py-4 text-sm font-medium text-gray-100 whitespace-nowrap">
                    <img
                      src={`${serverURL}/${category?.image}`}
                      alt="Category img"
                      className="rounded-full size-10"
                    />
                    {category?.name}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">
                    {category?.products?.length}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">
                    <Link
                      to={`/admin/edit-category/${category?._id}`}
                      key="fiuwei"
                      className="inline-flex mr-2 text-indigo-400 hover:text-indigo-300"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
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
export default CategoriesTable;
