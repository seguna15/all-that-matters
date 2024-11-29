import React, { useState } from 'react'
import { useCategoriesStore } from '../store/categoriesStore';
import { Link } from 'react-router-dom';
import { Minus, Plus } from 'lucide-react';

const Footer = () => {
  const [footerCategoryOpen, setFooterCategoryOpen] = useState(false)

  const {categories} = useCategoriesStore();
  const date = new Date()
  
  return (
    <div className="bg-gray-100">
      <div className="justify-between max-w-screen-lg px-4 py-10 mx-auto text-gray-800 sm:px-6 sm:flex">
        <div className="p-5 border-r sm:w-2/12">
          <div className="text-sm font-bold text-green-600 uppercase">Menu</div>
          <ul>
            <li className="my-2">
              <Link className="hover:text-green-600" to="/">
                Home
              </Link>
            </li>
            <li className="my-2">
              <span className="flex gap-2 mb-4 hover:text-green-600" href="#">
                Category{" "}
                {footerCategoryOpen ? (
                  <Minus
                    onClick={(e) => setFooterCategoryOpen(!footerCategoryOpen)}
                  />
                ) : (
                  <Plus
                    onClick={(e) => setFooterCategoryOpen(!footerCategoryOpen)}
                  />
                )}
              </span>
              {footerCategoryOpen && (
                <ul>
                  {categories?.map((category) => (
                    <Link
                      className="block ml-3 capitalize text-[16px] mb-2 hover:text-green-500"
                      key={category?._id}
                      to={`/category/${category._id}`}
                      state={{ name: category?.name }}
                    >
                      {category?.name}
                    </Link>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </div>
        <div className="p-5 text-center border-r sm:w-7/12">
          <h3 className="mb-4 text-xl font-bold text-green-600">
            All That Matters
          </h3>
          <p className="mb-10 text-sm text-gray-500">
            We are a Nigerian wholesales food brand. You can reach out to us for all forms of international shipping and containers.
          </p>
        </div>
        <div className="p-5 sm:w-3/12">
          <div className="text-sm font-bold text-green-600 uppercase">
            Contact Us
          </div>
          <ul>
            <li className="my-2">
              <a className="hover:text-green-600" href="#">
                Bodija Market, Ibadan, Oyo State, Nigeria.
              </a>
            </li>
            <li className="my-2">
              <a className="hover:text-green-600" href="#">
                contact@company.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col items-center max-w-screen-xl py-5 m-auto text-sm text-gray-800 border-t">
        <div className="flex flex-row mt-2 md:flex-auto md:flex-row-reverse"></div>
        <div className="my-5">&copy; Copyright {date.getFullYear()}. All Rights Reserved.</div>
      </div>
    </div>
  );
}

export default Footer