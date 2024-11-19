import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useProductsStore } from '../../store/productsStore';
import { motion } from 'framer-motion';
import ProductCard from '../../components/ProductCard';
import Footer from '../../components/Footer';
import { Navbar, Spinner } from '../../components';
import useScrollToTop from '../../shared/hooks/useScrollToTop';
import Filter from './components/Filter';
import { FilterIcon, XCircleIcon } from 'lucide-react';
import { useBrandsStore } from "../../store/brandsStore";
import MobileFilter from './components/MobileFilter';
import { Pagination } from '../../components/Pagination';

const CategoryPage = () => {
    const {category} = useParams();
    const location = useLocation();
    const {name} = location.state;
    const {fetchProductByCategory, isLoading, products, results, total, pagination} = useProductsStore()
    const { brands, loadBrands } = useBrandsStore();
    const [openMobileFilter, setOpenMobileFilter] = useState(false);
    
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10);
    const [brand, setBrand] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');

   

    let url = `products/category/${category}?page=${page}&limit=${limit}`;
  
    if(brand) {
      url = `products/category/${category}?page=${page}&limit=${limit}&brand=${brand}`;
    }
    if(price) {
      url = `products/category/${category}?page=${page}&limit=${limit}&brand=${brand}&price=${price}`;
    }
    if(quantity) {
      url = `products/category/${category}?page=${page}&limit=${limit}&brand=${brand}&price=${price}&quantity=${quantity}`;
    }

   
    
    useScrollToTop();
    
    useEffect(() => {
      fetchProductByCategory(url);
      loadBrands();
    }, [fetchProductByCategory, category, brand, price, quantity, limit, page]);
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
            <motion.h1
              className="mb-8 text-xl font-bold text-center capitalize sm:text-5xl text-emerald-400"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {name}
            </motion.h1>
            <div className="flex justify-center w-full gap-8">
              <FilterIcon
                size={22}
                className="lg:hidden"
                onClick={(e) => setOpenMobileFilter(!openMobileFilter)}
              />
              {openMobileFilter && (
                <MobileFilter
                  brands={brands}
                  brand={brand}
                  setBrand={setBrand}
                  price={price}
                  setPrice={setPrice}
                  quantity={quantity}
                  setQuantity={setQuantity}
                  openMobileFilter={openMobileFilter}
                  setOpenMobileFilter={setOpenMobileFilter}
                />
              )}

              <div className="hidden w-3/12 lg:block">
                <Filter
                  brands={brands}
                  brand={brand}
                  setBrand={setBrand}
                  price={price}
                  setPrice={setPrice}
                  quantity={quantity}
                  setQuantity={setQuantity}
                />
              </div>
              <motion.div
                className="flex flex-wrap items-center md:items-start justify-start w-9/12 gap-4"
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
            <Pagination
              limit={limit}
              setLimit={setLimit}
              page={page}
              setPage={setPage}
              total={total}
              results={results}
              pagination={pagination}
              length={products?.length}
            />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default CategoryPage