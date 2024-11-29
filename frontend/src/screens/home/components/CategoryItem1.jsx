import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useCategoriesStore } from '../../../store/categoriesStore';
import { serverURL } from '../../../api';


/* const categories = [
  { href: "/jeans", name: "Jeans", imageUrl: "/jeans.jpg" },
  { href: "/t-shirts", name: "T-shirts", imageUrl: "/tshirts.jpg" },
  { href: "/shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
  { href: "/glasses", name: "Glasses", imageUrl: "/glasses.png" },
  { href: "/jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
  { href: "/suits", name: "Suits", imageUrl: "/suits.jpg" },
  { href: "/bags", name: "Bags", imageUrl: "/bags.jpg" },
]; */

export const CategoryItem1 = () => {
  const {loadCategories, categories} = useCategoriesStore()
  
  useEffect(() => {
    loadCategories()
  }, [loadCategories])
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories?.map((category) => (
        <div
          key={category?._id}
          className="relative w-full overflow-hidden rounded-lg h-96 group"
        >
          <Link
            to={`/category/${category._id}`}
            state={{ name: category?.name }}
          >
            <div className="w-full h-full cursor-pointer">
              <div className="absolute inset-0 z-10 opacity-50 bg-gradient-to-b from-transparent to-gray-900" />
              <img
                src={`${serverURL}/${category?.image}`}
                alt={category?.name}
                className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
                <h3 className="mb-2 text-2xl font-bold text-white">
                  {category?.name}
                </h3>
                <p className="text-sm text-gray-200">
                  Explore {category?.name}
                </p>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
  
