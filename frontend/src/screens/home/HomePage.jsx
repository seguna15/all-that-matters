import React, { useEffect } from 'react'
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import {  Navbar } from '../../components';
import FeaturedProducts from './components/FeaturedProducts';
import { useProductsStore } from '../../store/productsStore';
import Footer from '../../components/Footer';
import useScrollToTop from '../../shared/hooks/useScrollToTop';
import { useCartsStore } from '../../store/cartsStore';
import Hero from './components/Hero';
import CategoryItems from './components/CategoryItems';


const HomePage = () => {
    
   
    const { fetchFeaturedProducts, products, productLoading } =
      useProductsStore();
   
    useScrollToTop();
    useEffect(() => {
      
      fetchFeaturedProducts();
    }, [fetchFeaturedProducts]);
  
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen mt-20 overflow-hidden text-white bg-gray-900 font-nunitoSans">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
          </div>
        </div>
        <Hero />

       
          
        <CategoryItems />
       

        {!productLoading && products?.length > 0 && (
          <FeaturedProducts featuredProducts={products} />
        )}
      </main>

      <Footer />
    </>
  );
}

export default HomePage