import Header from "../../components/common/Header";
import { useBrandsStore } from "../../../../store/brandsStore";
import { useEffect, useState } from "react";
import BrandForm from "./BrandForm";
import { useNavigate } from "react-router-dom";

const AddBrandPage = () => {
	const { isLoading, createBrand, isAdded, resetStore } = useBrandsStore();
  const navigate = useNavigate()
	const [newBrand, setNewBrand] = useState({
        name: "",
  })
	const handleCreate = async () => {
		await createBrand(newBrand);
		setNewBrand({
			name: "",
			
		});
	}

  useEffect(() => {
    if(isAdded) {
      resetStore()
      navigate("/admin/brands")
    }
  },[isAdded])

	return (
    <div className="relative z-10 flex-1 overflow-auto">
      <Header title="Categories" />

      <main className="px-4 py-6 mx-auto max-w-7xl lg:px-8">
        <BrandForm
          formLabel="Create New Brand"
          handleSubmit={handleCreate}
          isLoading={isLoading}
          newBrand={newBrand}
          setNewBrand={setNewBrand}
          submitLabel="Create Brand"
        />
      </main>
    </div>
  );
};
export default AddBrandPage;
