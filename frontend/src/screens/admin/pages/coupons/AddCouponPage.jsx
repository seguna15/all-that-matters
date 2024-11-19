import Header from "../../components/common/Header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCouponsStore } from "../../../../store/couponsStore";
import CouponForm from "./CouponForm";

const AddCouponPage = () => {
  const navigate = useNavigate();
	const { isLoading, isAdded, createCoupon, resetStore } = useCouponsStore();
  
	const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountPercentage: "",
    expirationDate: "",
    maxUsage: "",
  });


	const handleCreate = async () => {
		await createCoupon(newCoupon)
		setNewCoupon({
      code: "",
      discountPercentage: "",
      expirationDate: "",
      maxUsage: "",
    });
	}

  useEffect(() => {
    if(isAdded) {
      resetStore()  
      navigate("/admin/coupons")
    }
  },[isAdded])
  
	return (
    <div className="relative z-10 flex-1 overflow-auto">
      <Header title="Coupons" />

      <main className="px-4 py-6 mx-auto max-w-7xl lg:px-8">
        <CouponForm
          handleSubmit={handleCreate}
          couponLoading={isLoading}
          newCoupon={newCoupon}
          setNewCoupon={setNewCoupon}
          formLabel="Add New Coupon"
          submitLabel="Add Coupon"
        />
      </main>
    </div>
  );
};
export default AddCouponPage;
