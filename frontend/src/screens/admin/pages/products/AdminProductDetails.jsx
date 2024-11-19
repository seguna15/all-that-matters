import React, { useEffect, useRef, useState } from "react";


import { serverURL } from "../../../../api";
import { useParams } from "react-router-dom";
import { Carousel } from "../../../../components";
import { ChevronRight } from "lucide-react";
import { Spinner } from "../../../../components";

import { useProductsStore } from "../../../../store/productsStore";
import Header from "../../components/common/Header";

const AdminProductDetails = () => {
  
  const {id} = useParams()

  const {fetchProductById, product, isLoading} = useProductsStore()

  useEffect(()=> {
    fetchProductById(id)
  },[fetchProductById, id])

  const [amount, setAmount] = useState(1);

  
  return (
    <>
     

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="relative z-10 flex-1 overflow-auto">
          <Header title="Products" />

          <main className="px-4 py-6 mx-auto max-w-7xl lg:px-8">
            <div className="flex flex-col justify-between gap-16 lg:flex-row lg:items-center">
              
              <div className="flex flex-col gap-6 lg:w-1/3">
                <Carousel autoSlide={false}>
                  {product?.images?.map((image) => (
                    <img
                      key={image}
                      src={`${serverURL}/${image}`}
                      alt={image}
                      className="object-cover"
                    />
                  ))}
                </Carousel>
              </div>

              <div className="flex flex-col gap-4 lg:w-2/3">
                <div>
                  <span className="font-semibold text-gray-200 capitalize">
                    {product?.category?.name}{" "}
                    <ChevronRight className="inline w-4 h-4" />{" "}
                    {product?.brand?.name}
                  </span>
                  <h1 className="text-3xl font-bold capitalize">
                    {product?.name}
                  </h1>
                </div>
                <h3 className="text-sm text-green-500">
                  {product?.totalSold} total sold
                </h3>
                <p className="text-gray-300 text-balance">
                  {product?.description}
                </p>
                <h2 className="text-2xl font-semibold text-green-500">
                  {" "}
                  &#8358;{product?.price?.toFixed(2)}
                </h2>
                <h3 className="text-gray-300 text-md">
                  {product?.quantity} items in stock
                </h3>
                
              </div>

            </div>
          </main>
        </div>
        
      )}

 
    </>
  );
};

export default AdminProductDetails;
