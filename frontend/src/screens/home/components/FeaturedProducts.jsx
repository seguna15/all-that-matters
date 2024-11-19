import { useEffect, useState } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useCartsStore } from "../../../store/cartsStore";
import { serverURL } from "../../../api";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../../../store/authStore";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { EffectCoverflow, Pagination, Navigation } from "swiper/modules"
import ProductCard from "../../../components/ProductCard";

const FeaturedProducts = ({ featuredProducts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  const { addToCart } = useCartsStore();
  const { user } = useAuthStore();
  
  const handleAddToCart = async (product) => {
    if (!user) {
      toast.error("Please login to add item to cart");
    } else {
      addToCart(product);
    }
  };


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else if (window.innerWidth < 1280) setItemsPerPage(3);
      else setItemsPerPage(4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex + itemsPerPage);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex - itemsPerPage);
  };

  const isStartDisabled = currentIndex === 0;
  const isEndDisabled = currentIndex >= featuredProducts?.length - itemsPerPage;

  return (
    <section id="featured-products" className="py-16">
      <div className="container px-4 mx-auto">
        <h2 className="mb-4 text-3xl font-bold text-center sm:text-4xl text-emerald-400">
          Featured Products
        </h2>
        <p className="mb-12 text-xl text-center text-gray-300">
          Discover the best agricultural and food products from Nigeria
        </p>
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          slidesPerView={"auto"}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
          }}
          pagination={{ el: ".swiper-pagination", clickable: true }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
            clickable: true,
          }}
          modules={[EffectCoverflow, Pagination, Navigation]}
          className="swiper_container"
        >
          {featuredProducts?.map((product) => (
            <SwiperSlide className="flex justify-center">
              <ProductCard product={product} />
            </SwiperSlide>
          ))}

          <div className="slider-controler">
            <div className="swiper-button-prev slider-arrow">
              <ion-icon name="arrow-back-outline"></ion-icon>
            </div>
            <div className="swiper-button-next slider-arrow">
              <ion-icon name="arrow-forward-outline"></ion-icon>
            </div>
            <div className="swiper-pagination"></div>
          </div>
        </Swiper>
        
      </div>
    </section>
  );
};
export default FeaturedProducts;
