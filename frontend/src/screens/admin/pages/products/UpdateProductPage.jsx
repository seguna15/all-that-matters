
import Header from "../../components/common/Header";
import ProductForm from "./ProductForm";
import { useProductsStore } from "../../../../store/productsStore";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../../../../shared/hooks/useFetch";
import useProduct from "../../../../shared/hooks/useProduct";


const UpdateProductsPage = () => {
  const {id} = useParams();
 
  const navigate = useNavigate();
  const { newProduct, setNewProduct, isFetchLoading } = useProduct(id);
 
	const { productLoading, updateProduct, isUpdated, resetStore } = useProductsStore();
	
	const handleCreate = async () => {
		await updateProduct(newProduct, id)
		setNewProduct({
      name: "",
      description: "",
      price: "",
      category: "",
      brand: "",
      images: [],
      quantity: "",
    });
	}

  useEffect(() => {
    if(isUpdated) {
      resetStore();
      navigate("/admin/products");
    }
  },[isUpdated])
	return (
    <div className="relative z-10 flex-1 overflow-auto">
      <Header title="Products" />

      <main className="px-4 py-6 mx-auto max-w-7xl lg:px-8">
        {!isFetchLoading && (
          <ProductForm
            handleSubmit={handleCreate}
            productLoading={productLoading}
            newProduct={newProduct}
            setNewProduct={setNewProduct}
            formLabel="Update Brand"
            submitLabel="Update Brand"
          />
        )}
      </main>
    </div>
  );
};
export default UpdateProductsPage;
