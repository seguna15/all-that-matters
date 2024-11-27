import { useEffect, useState } from "react";
import { apiClient } from "../../api";
import toast from "react-hot-toast";

export default function useProduct(id) {
  
    const [newProduct, setNewProduct] = useState({
      name: "",
      description: "",
      price: "",
      category: "",
      brand: "",
      unit: "",
      images: [],
      quantity: "",
    });
    const [isFetchLoading, setIsFetchLoading] = useState(false);

    const  getData = async (id) =>  {
      try {
        setIsFetchLoading(true);
        const {data} = await apiClient.get(`products/${id}`);
        
        setNewProduct({
          name: data?.product?.name,
          description:  data?.product?.description,
          price:  data?.product?.price,
          category:  data?.product?.category?._id,
          brand:  data?.product?.brand?._id,
          unit: data?.product?.unit,
          images: [],
          quantity:  data?.product?.quantity,
        });
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Oops we could not fetch brand"
        );
      } finally {
        setIsFetchLoading(false);
      }
    }

    useEffect(() => {
        getData(id);
    }, [id]);

  return { newProduct, setNewProduct, isFetchLoading };
}
