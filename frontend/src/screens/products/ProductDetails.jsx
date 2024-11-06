import React, { useEffect, useState } from "react";
import { useProductsStore } from "../../store/productsStore";
import { Spinner } from "../../components";
import { serverURL } from "../../api";
import { useParams } from "react-router-dom";
import { Carousel } from "../../components";

const ProductDetails = () => {
  
    const {id} = useParams()
    console.log(id)
  const {fetchProductById, product, isLoading} = useProductsStore()
    
  useEffect(()=> {
    fetchProductById(id)
  },[fetchProductById, id])
  const [activeImg, setActiveImage] = useState(`${serverURL}/${product?.images[0]}`);

  const [amount, setAmount] = useState(1);

  console.log(product)
  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="relative min-h-screen overflow-hidden text-white">
          <div className="relative z-10 px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
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
                    {product?.category?.name} {product?.brand?.name}
                  </span>
                  <h1 className="text-3xl font-bold capitalize">
                    {product?.name}
                  </h1>
                </div>
                <p className="text-gray-300">{product?.description}</p>
                <h2 className="text-2xl font-semibold">
                  {" "}
                  &#8358;{product?.price?.toFixed(2)}
                </h2>
                <h3 className="text-gray-300 text-md">
                  {product?.quantity} items in stock
                </h3>
                <div className="flex flex-row items-center gap-12">
                  <div className="flex flex-row items-center">
                    <button
                      className="px-5 py-2 text-3xl bg-gray-200 rounded-lg text-violet-800"
                      onClick={() => setAmount((prev) => prev - 1)}
                    >
                      -
                    </button>
                    <span className="px-6 py-4 rounded-lg">{amount}</span>
                    <button
                      className="px-4 py-2 text-3xl bg-gray-200 rounded-lg text-violet-800"
                      onClick={() => setAmount((prev) => prev + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button className="h-full px-16 py-3 font-semibold text-white bg-violet-800 rounded-xl">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetails;
