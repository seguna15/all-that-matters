import React, { useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useProductsStore } from '../../store/productsStore';
import { motion } from 'framer-motion';
import ProductCard from '../../components/ProductCard';
const CategoryPage = () => {
    const {category} = useParams();
    const location = useLocation();
    const {name} = location.state;
    const {fetchProductByCategory, isLoading, products} = useProductsStore()
    const url = `products/category/${category}`;

    
    useEffect(() => {
        fetchProductByCategory(url)
    },[fetchProductByCategory,category])
  return (
    <div className="min-h-screen">
      <div className="relative z-10 max-w-screen-xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
        <motion.h1
          className="mb-8 text-xl font-bold text-center capitalize sm:text-5xl text-emerald-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {name}
        </motion.h1>
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {products?.length === 0 && (
            <h2 className="text-3xl font-semibold text-center text-gray-300 col-span-full">
              No products found
            </h2>
          )}

          {products?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default CategoryPage