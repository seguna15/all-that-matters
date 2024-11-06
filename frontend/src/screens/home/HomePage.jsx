import React, { useEffect } from 'react'
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { CategoryItem } from '../../components';
import FeaturedProducts from './components/FeaturedProducts';
import { useProductsStore } from '../../store/productsStore';


const HomePage = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate()
    const { fetchFeaturedProducts, products, productLoading } =
      useProductsStore();
    console.log(products)
  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);
  
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div className="relative z-10 px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h1 className="mb-4 text-5xl font-bold text-center sm:text-6xl text-emerald-400">
          Explore Our Categories
        </h1>
        <p className="mb-12 text-xl text-center text-gray-300">
          Discover the best agricultural and food products from Nigeria
        </p>
        <CategoryItem />

        
        {!productLoading && products?.length > 0 && (
          <FeaturedProducts featuredProducts={products} />
        )}
      </div>
    </div>
  );
}

export default HomePage