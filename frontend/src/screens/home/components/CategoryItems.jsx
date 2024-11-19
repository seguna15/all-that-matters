import { useEffect, useState } from "react";
import {  ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { serverURL } from "../../../api";
import { Link } from "react-router-dom";
import { useCategoriesStore } from "../../../store/categoriesStore";

const CategoryItems = () => {

  const { fetchFeaturedCategories, featuredCategories:categories } = useCategoriesStore();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(4);
  useEffect(() => {
    fetchFeaturedCategories();
  }, [fetchFeaturedCategories]);

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
  const isEndDisabled = currentIndex >= categories?.length - itemsPerPage;

  return (
    <section id="featured-products" className="relative z-10 px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="container px-4 mx-auto">
        <h2 className="mb-4 text-3xl font-bold text-center sm:text-4xl text-emerald-400">
          Explore Our Categories
        </h2>
        <p className="mb-12 text-xl text-center text-gray-300">
          Explore categories to see the best selection of foodstuffs.
        </p>
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / itemsPerPage)
                }%)`,
              }}
            >
              {categories?.map((category) => (
                <div
                  key={category?._id}
                  className="flex-shrink-0 w-full px-2 sm:w-1/2 lg:w-1/3 xl:w-1/4"
                >
                  <div className="h-full overflow-hidden transition-all duration-300 bg-white border rounded-lg shadow-lg bg-opacity-10 backdrop-blur-sm hover:shadow-xl border-emerald-500/30 group">
                    <div className="overflow-hidden">
                      <img
                        src={`${serverURL}/${category?.image}`}
                        alt={category?.name}
                        className="object-cover w-full h-64 transition-transform duration-300 ease-in-out group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4 group:hover:absolute">
                      <h3 className="mb-2 text-lg font-semibold text-white capitalize">
                        {category?.name}({category?.products?.length})
                      </h3>

                      <Link
                        to={`category/${category?._id}`}
                        state={{ name: category?.name }}
                        className="flex items-center justify-center gap-2 px-4 py-2 font-semibold text-gray-800 transition-colors duration-300 bg-yellow-400 rounded w-fit hover:bg-yellow-500 group "
                      >
                        <span>View More</span>
                        <ArrowRight className="transition-[scale] duration-500 group-hover:scale-125" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={prevSlide}
            disabled={isStartDisabled}
            className={`absolute top-1/2 -left-4 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 ${
              isStartDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-500"
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            disabled={isEndDisabled}
            className={`absolute top-1/2 -right-4 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 ${
              isEndDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-500"
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};
export default CategoryItems;
