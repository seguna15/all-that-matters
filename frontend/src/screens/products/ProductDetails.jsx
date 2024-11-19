import React, { useEffect, useRef, useState } from "react";
import { useProductsStore } from "../../store/productsStore";
import { Navbar, Spinner } from "../../components";
import { serverURL } from "../../api";
import { useParams } from "react-router-dom";
import { Carousel } from "../../components";
import { ChevronRight } from "lucide-react";
import { useCartsStore } from "../../store/cartsStore";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";
import Footer from "../../components/Footer";
import useScrollToTop from "../../shared/hooks/useScrollToTop";

const ProductDetails = () => {
  
  const {id} = useParams()
  const {addToCart, isLoading: cartLoading} = useCartsStore();
  const {user} = useAuthStore();
  
  const {fetchProductById, product, isLoading} = useProductsStore()

  useScrollToTop();
  useEffect(()=> {
    fetchProductById(id)
    
    
  },[fetchProductById, id])


  const handleAddToCart = async () => {
      if(!user) {
        toast.error("Please login to add item to cart")
      }else {
        addToCart(product)
      }
  }

  return (
    <>
      <Navbar />

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="relative min-h-screen mt-20 overflow-hidden text-white bg-gray-900 font-nunitoSans">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
            </div>
          </div>

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
                <button
                  disabled={product?.quantity < 1 || cartLoading ? true : false}
                  className="h-full px-16 py-3 font-semibold text-white bg-green-600 w-fit rounded-xl hover:bg-green-500 disabled:bg-gray-500"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default ProductDetails;
