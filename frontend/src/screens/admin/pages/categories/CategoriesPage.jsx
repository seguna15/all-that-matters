import { useCategoriesStore } from "../../../../store/categoriesStore";
import Header from "../../components/common/Header";

import CategoriesTable from "./CategoriesTable";
import { useEffect } from "react";


const CategoriesPage = () => {
	const {fetchAllCategories} = useCategoriesStore();
	
	useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);
	return (
		<div className='relative z-10 flex-1 overflow-auto'>
			<Header title='Categories' />

			<main className='px-4 py-6 mx-auto max-w-7xl lg:px-8'>
				
		
				<CategoriesTable />

				
				
			</main>
		</div>
	);
};
export default CategoriesPage;
