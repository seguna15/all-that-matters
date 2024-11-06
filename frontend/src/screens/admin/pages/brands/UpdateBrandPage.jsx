
import Header from "../../components/common/Header";
import { useBrandsStore } from "../../../../store/brandsStore";
import { useEffect } from "react";
import BrandForm from "./BrandForm";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../../../../shared/hooks/useFetch";

const UpdateBrandPage = () => {
  const {id} = useParams()
  const navigate = useNavigate()
 
	const { isLoading, updateBrand, isUpdated, resetStore } = useBrandsStore();
  
 
  const { data, setData, isFetchLoading } = useFetch('brands', id, "brand")

	const handleCreate = async () => {
		await updateBrand(data.name, id);
		setData(null);
	}

  useEffect(() => {
    if(isUpdated) {
      resetStore();
      navigate('/admin/brands')
    }
  },[isUpdated])
  
	return (
    <div className="relative z-10 flex-1 overflow-auto">
      <Header title="Categories" />

      <main className="px-4 py-6 mx-auto max-w-7xl lg:px-8">
        {!isFetchLoading && (
          <BrandForm
            formLabel="Update Brand"
            handleSubmit={handleCreate}
            isLoading={isLoading}
            newBrand={data}
            setNewBrand={setData}
            submitLabel="Update Brand"
          />
        )}
      </main>
    </div>
  );
};
export default UpdateBrandPage;
