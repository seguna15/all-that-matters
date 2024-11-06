import { useProductsStore } from "../../../../store/productsStore";
import Header from "../../components/common/Header";

import ProductsTable from "./ProductsTable";
import { useEffect } from "react";


const ProductsPage = () => {
	const {fetchAllProducts} = useProductsStore();
	
	useEffect(() => {
		fetchAllProducts();
	}, [fetchAllProducts]);
	return (
		<div className='relative z-10 flex-1 overflow-auto'>
			<Header title='Products' />

			<main className='px-4 py-6 mx-auto max-w-7xl lg:px-8'>
				
		
				<ProductsTable />

				
				
			</main>
		</div>
	);
};
export default ProductsPage;
