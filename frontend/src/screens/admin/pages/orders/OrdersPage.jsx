import { CheckCircle, Clock, DollarSign, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../../components/common/Header";

import OrdersTable from "./components/OrdersTable";
import { useOrdersStore } from "../../../../store/ordersStore";
import { useEffect } from "react";


const OrdersPage = () => {
	const {fetchAllOrders} = useOrdersStore()

	useEffect(() => {
		fetchAllOrders()
	},[fetchAllOrders])
	
	return (
		<div className='relative z-10 flex-1 overflow-auto'>
			<Header title={"Orders"} />

			<main className='px-4 py-6 mx-auto max-w-7xl lg:px-8'>
				
				<OrdersTable />
			</main>
		</div>
	);
};
export default OrdersPage;
