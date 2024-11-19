import React, { useEffect } from "react";
import {  XCircleIcon } from "lucide-react";
import { priceRange, quantityRange } from "../../../shared/data/data";

const MobileFilter = ({
  brands,
  openMobileFilter,
  setOpenMobileFilter,
  brand,
  setBrand,
  price,
  setPrice,
  quantity,
  setQuantity,
}) => {

  const handleBrandChange = (e) => {
    setBrand(e.target.value)
    setOpenMobileFilter(!openMobileFilter)
  }
  const handlePriceChange = (e) => {
    setPrice(e.target.value)
    setOpenMobileFilter(!openMobileFilter)
  }
  const handleQuantityChange = (e) => {
    setQuantity(e.target.value)
    setOpenMobileFilter(!openMobileFilter)
  }
  return (
    <div className="absolute top-0 left-0 z-50 w-full min-h-screen pb-8 transition-all duration-300 ease-in-out delay-100 bg-gray-100 lg:hidden w-90 dark:bg-gray-800 rounded-xl ">
      <div className="flex flex-col w-full gap-4 p-4">
        <div className="flex items-center justify-between py-2 border-b border-gray-200">
          <h1 className="text-[20px] font-medium">Filters</h1>
          <XCircleIcon
            size={22}
            className=""
            onClick={(e) => setOpenMobileFilter(!openMobileFilter)}
          />
        </div>
        <div className="flex flex-col items-start justify-start w-full gap-6">
          <div className="flex flex-col w-full gap-2">
            <h2 className="text-[18px] text-gray-800 dark:text-white border-b border-gray-200">
              Brand
            </h2>
            <select
              className="w-full px-3 py-2 capitalize border rounded-lg dark:bg-gray-700 dark:text-white dark:border-none"
              id="brand"
              name="brand"
              onChange={handleBrandChange}
              value={brand}
            >
              <option value="">Choose brand</option>
              {brands?.map((brand) => (
                <option key={brand?._id} value={brand?._id}>
                  {brand?.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-full gap-2">
            <h2 className="text-[18px] text-gray-800 dark:text-white border-b border-gray-200">
              Price
            </h2>
            <select
              className="w-full px-3 py-2 capitalize border rounded-lg dark:bg-gray-700 dark:text-white dark:border-none"
              id="price"
              name="price"
              onChange={handlePriceChange}
              value={price}
            >
              <option value="">Choose price</option>
              {priceRange?.map((price) => (
                <option key={price?.val} value={price?.val}>
                  {price?.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-full gap-2">
            <h2 className="text-[18px] text-gray-800 dark:text-white border-b border-gray-200">
              Quantity
            </h2>
            <select
              className="w-full px-3 py-2 capitalize border rounded-lg dark:bg-gray-700 dark:text-white dark:border-none"
              id="quantity"
              name="quantity"
              onChange={handleQuantityChange}
              value={quantity}
            >
              <option value="">Choose quantity</option>
              {quantityRange?.map((quantity) => (
                <option key={quantity?.val} value={quantity?.val}>
                  {quantity?.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFilter;
