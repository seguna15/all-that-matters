import Header from "../../components/common/Header";
import { useCategoriesStore } from "../../../../store/categoriesStore";
import { useEffect, useState } from "react";
import CategoryForm from "./CategoryForm";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../../../../shared/hooks/useFetch";

const UpdateCategoryPage = () => {
  const {id} = useParams()
  const navigate = useNavigate()
	const { isLoading,  isUpdated, updateCategory, resetStore } = useCategoriesStore();

  const { data, setData, isFetchLoading } = useFetch("categories", id, "category");
	
	const handleCreate = async () => {
		await updateCategory({name: data?.name, images: data?.images}, id);
		setData(null);
	}

  useEffect(() => {
    if (isUpdated) {
      resetStore();
      navigate("/admin/categories");
    }
  }, [isUpdated]);
  
	return (
    <div className="relative z-10 flex-1 overflow-auto">
      <Header title="Categories" />

      <main className="px-4 py-6 mx-auto max-w-7xl lg:px-8">
        {!isFetchLoading && (
          <CategoryForm
            formLabel="Update Category"
            handleSubmit={handleCreate}
            isLoading={isLoading}
            newCategory={data}
            setNewCategory={setData}
            submitLabel="Update Category"
          />
        )}
      </main>
    </div>
  );
};
export default UpdateCategoryPage;
