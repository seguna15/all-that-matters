import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useUsersStore } from "../../../../../store/usersStore";
import { Spinner } from "../../../../../components";



const UsersTable = ({users}) => {
	const [searchTerm, setSearchTerm] = useState("");
	const { filteredUsers, filterUser, toggleUserRole, toggleUserStatus, isLoading } = useUsersStore();

	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		filterUser(term)
	};

	return (
    <motion.div
      className="p-6 bg-gray-800 bg-opacity-50 border border-gray-700 shadow-lg backdrop-blur-md rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-100">Users</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                className="py-2 pl-10 pr-4 text-white placeholder-gray-400 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={handleSearch}
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                    Role
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                    Status
                  </th>
                  {/* <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                    Actions
                  </th> */}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-700">
                {filteredUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10">
                          <div className="flex items-center justify-center w-10 h-10 font-semibold text-white rounded-full bg-gradient-to-r from-purple-400 to-blue-500">
                            {user?.name.charAt(0)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-100">
                            {user?.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{user?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user?.orders?.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 text-xs font-semibold leading-5 text-blue-100  rounded-full
                          ${user?.isAdmin ? "bg-yellow-800" : "bg-blue-800"}`}
                        onClick={() => toggleUserRole(user?._id)}
                      >
                        {user?.isAdmin ? "Admin" : "User"}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isVerified === true
                            ? "bg-green-800 text-green-100"
                            : "bg-red-800 text-red-100"
                        }`}
                        onClick={() => toggleUserStatus(user?._id)}
                      >
                        {user.isVerified ? "verified" : "unverified"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">
                      {/* <button className="mr-2 text-indigo-400 hover:text-indigo-300">
                    Edit
                  </button> */}
                      {/* <button className="text-red-400 hover:text-red-300">
                        Delete
                      </button> */}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </motion.div>
  );
};
export default UsersTable;
