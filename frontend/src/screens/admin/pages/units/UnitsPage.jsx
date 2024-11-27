import { useUnitsStore } from "../../../../store/unitsStore";
import Header from "../../components/common/Header";

import UnitsTable from "./UnitsTable";
import { useEffect } from "react";


const UnitsPage = () => {
	const {fetchAllUnits} = useUnitsStore();
	
	useEffect(() => {
    fetchAllUnits();
  }, [fetchAllUnits]);
	return (
		<div className='relative z-10 flex-1 overflow-auto'>
			<Header title='Units' />

			<main className='px-4 py-6 mx-auto max-w-7xl lg:px-8'>
				
		
				<UnitsTable />

				
				
			</main>
		</div>
	);
};
export default UnitsPage;
