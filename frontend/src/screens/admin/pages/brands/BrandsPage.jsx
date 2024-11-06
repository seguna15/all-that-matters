import { useBrandsStore } from "../../../../store/brandsStore";
import Header from "../../components/common/Header";

import BrandsTable from "./BrandsTable";
import { useEffect } from "react";


const BrandsPage = () => {
	const {fetchAllBrands} = useBrandsStore();
	
	useEffect(() => {
    fetchAllBrands();
  }, [fetchAllBrands]);
	return (
		<div className='relative z-10 flex-1 overflow-auto'>
			<Header title='Brands' />

			<main className='px-4 py-6 mx-auto max-w-7xl lg:px-8'>
				
		
				<BrandsTable />

				
				
			</main>
		</div>
	);
};
export default BrandsPage;
