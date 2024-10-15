import { motion } from "framer-motion";

import Header from "../../components/common/Header";
import StatCard from "../../components/common/StatCard";

import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
import CategoryDistributionChart from "../../components/overview/CategoryDistributionChart";
import SalesTrendChart from "../../components/products/SalesTrendChart";
import ProductsTable from "../../components/products/ProductsTable";
import ProductForm from "../../components/common/ProductForm";

const ProductsPage = () => {
	return (
		<div className='relative z-10 flex-1 overflow-auto'>
			<Header title='Products' />

			<main className='px-4 py-6 mx-auto max-w-7xl lg:px-8'>
				
				<ProductForm/>

				
			</main>
		</div>
	);
};
export default ProductsPage;
