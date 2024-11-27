
import Header from "../../components/common/Header";
import ProductForm from "./ProductForm";
import { useProductsStore } from "../../../../store/productsStore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddProductsPage = () => {
  const navigate = useNavigate();
	const { isLoading, isAdded, createProduct, resetStore } = useProductsStore();
	const [newProduct, setNewProduct] = useState({
      name: "",
      description: "",
      price: "",
      category: "",
      brand: "",
      unit: "",
      images: [],
      quantity: ""
  })

  

	const handleCreate = async () => {
		await createProduct(newProduct)
		setNewProduct({
			name: "",
			description: "",
			price: "",
			category: "",
      brand: "",
      unit: "",
			images: [],
			quantity: "",
		});
	}

  useEffect(() => {
    if(isAdded) {
      resetStore()  
      navigate("/admin/products")
    }
  },[isAdded])
  
	return (
    <div className="relative z-10 flex-1 overflow-auto">
      <Header title="Products" />

      <main className="px-4 py-6 mx-auto max-w-7xl lg:px-8">
        <ProductForm
          handleSubmit={handleCreate}
          productLoading={isLoading}
          newProduct={newProduct}
          setNewProduct={setNewProduct}
          formLabel="Add New Product"
          submitLabel="Add Product"
        />
      </main>
    </div>
  );
};
export default AddProductsPage;
