
import Header from "../../components/common/Header";
import { useCategoriesStore } from "../../../../store/categoriesStore";
import { useEffect, useState } from "react";
import CategoryForm from "./CategoryForm";
import { useNavigate } from "react-router-dom";

const AddCategoryPage = () => {
	const { isLoading, createCategory, isAdded, resetStore } = useCategoriesStore();
  const navigate = useNavigate();
	const [newCategory, setNewCategory] = useState({
        name: "",
        images: [],
        
    })
	const handleCreate = async () => {
		await createCategory(newCategory);
		setNewCategory({
			name: "",
			images: [],
		});
	}

  useEffect(() => {
    if(isAdded){
      resetStore();
      navigate("/admin/categories")
    }
  },[isAdded])
	return (
    <div className="relative z-10 flex-1 overflow-auto">
      <Header title="Categories" />

      <main className="px-4 py-6 mx-auto max-w-7xl lg:px-8">
        <CategoryForm
          formLabel="Create New Category"
          handleSubmit={handleCreate}
          isLoading={isLoading}
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          submitLabel="Create Category"
        />
      </main>
    </div>
  );
};
export default AddCategoryPage;
