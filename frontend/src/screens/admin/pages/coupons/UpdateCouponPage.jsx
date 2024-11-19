import Header from "../../components/common/Header";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../../../../shared/hooks/useFetch";
import { useCouponsStore } from "../../../../store/couponsStore";
import CouponForm from "./CouponForm";


const UpdateCouponPage = () => {
  const {id} = useParams();
 
  const navigate = useNavigate();
  const { data, setData, isFetchLoading } = useFetch(
    "coupons/fetch-single",
    id,
    "coupon"
  );
 

	const { isLoading, updateCoupon, isUpdated, resetStore } = useCouponsStore();
	
	const handleUpdate = async () => {
		await updateCoupon(data, id)
		setData(null);
	}

  useEffect(() => {
    if(isUpdated) {
      resetStore();
      navigate("/admin/coupons");
    }
  },[isUpdated])
  
	return (
    <div className="relative z-10 flex-1 overflow-auto">
      <Header title="Products" />

      <main className="px-4 py-6 mx-auto max-w-7xl lg:px-8">
        {!isFetchLoading && (
          <CouponForm
            handleSubmit={handleUpdate}
            couponLoading={isLoading}
            newCoupon={data}
            setNewCoupon={setData}
            formLabel="Update Coupon"
            submitLabel="Update Coupon"
          />
        )}
      </main>
    </div>
  );
};
export default UpdateCouponPage;
