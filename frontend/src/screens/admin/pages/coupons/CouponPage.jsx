import { useCouponsStore } from "../../../../store/couponsStore";
import Header from "../../components/common/Header";

import { useEffect } from "react";
import CouponsTable from "./CouponTable";


const CouponsPage = () => {
	const {fetchAllCoupons} = useCouponsStore();
	
	useEffect(() => {
    fetchAllCoupons();
  }, [fetchAllCoupons]);
	return (
		<div className='relative z-10 flex-1 overflow-auto'>
			<Header title='Products' />

			<main className='px-4 py-6 mx-auto max-w-7xl lg:px-8'>
				
		
				<CouponsTable />

				
				
			</main>
		</div>
	);
};
export default CouponsPage;
