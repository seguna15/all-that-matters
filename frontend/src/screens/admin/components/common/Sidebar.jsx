import {
  BarChart2,
  DollarSign,
  Menu,
  Settings,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  Users,
  Layers3,
} from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { SIDEBAR_ITEMS } from "../../../../shared/data";


const Sidebar = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [activeTab, setActiveTab] = useState("overview");

	return (
		<motion.div
			className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
				isSidebarOpen ? "w-64" : "w-20"
			}`}
			animate={{ width: isSidebarOpen ? 256 : 80 }}
		>
			<div className='flex flex-col h-full p-4 bg-gray-800 bg-opacity-50 border-r border-gray-700 backdrop-blur-md'>
				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={() => setIsSidebarOpen(!isSidebarOpen)}
					className='p-2 transition-colors rounded-full hover:bg-gray-700 max-w-fit'
				>
					<Menu size={24} />
				</motion.button>

				<nav className='flex-grow mt-8'>
					{SIDEBAR_ITEMS.map((item) => (
						<Link key={item.href} to={item.href} onClick={() =>setActiveTab(item.id)}>
							<motion.div className={`flex items-center p-4 mb-2 text-sm font-medium transition-colors rounded-lg hover:bg-gray-700 ${
								activeTab === item.id ? "bg-gray-600" : ""
							}`}>
								<item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
								<AnimatePresence>
									{isSidebarOpen && (
										<motion.span
											className='ml-4 whitespace-nowrap'
											initial={{ opacity: 0, width: 0 }}
											animate={{ opacity: 1, width: "auto" }}
											exit={{ opacity: 0, width: 0 }}
											transition={{ duration: 0.2, delay: 0.3 }}
										>
											{item.name}
										</motion.span>
									)}
								</AnimatePresence>
							</motion.div>
						</Link>
					))}
				</nav>
			</div>
		</motion.div>
	);
};
export default Sidebar;
