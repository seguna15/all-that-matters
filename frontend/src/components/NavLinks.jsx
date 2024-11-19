import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { links } from "./Mylinks";
import { useCategoriesStore } from "../store/categoriesStore";

const NavLinks = ({open, setOpen}) => {
  const [heading, setHeading] = useState("");
  const [subHeading, setSubHeading] = useState("");
  const {categories,  fetchActiveCategories} = useCategoriesStore()
  useEffect(() => {
    fetchActiveCategories()
  },[fetchActiveCategories])


  return (
    <>
      {links.map((link) => (
        <div key={link?.name}>
          <div className="px-3 text-left md:cursor-pointer group">
            <h1
              className="flex items-center justify-between pr-5 py-7 md:pr-0 group"
              onClick={() => {
                heading !== link.name ? setHeading(link.name) : setHeading("");
                setSubHeading("");
              }}
            >
              {link.name}
              <span className="inline text-xl md:hidden">
                <ion-icon
                  name={`${
                    heading === link.name ? "chevron-up" : "chevron-down"
                  }`}
                ></ion-icon>
              </span>
              <span className="hidden text-xl md:mt-1 md:ml-2 md:block group-hover:rotate-180 group-hover:-mt-2">
                <ion-icon name="chevron-down"></ion-icon>
              </span>
            </h1>
            {link.submenu && (
              <div>
                <div className="absolute hidden top-20 group-hover:md:block hover:md:block">
                  <div className="py-3">
                    <div className="absolute w-4 h-4 mt-1 rotate-45 bg-white left-3"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-10 p-5 bg-white">
                    {categories.map((category) => (
                      <div key={category?._id}>
                        <Link
                          key={category?._id}
                          to={`/category/${category._id}`}
                          state={{ name: category?.name }}
                          className="font-semibold capitalize text-md"
                        >
                          {category.name}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Mobile menus */}
          <div
            className={`
            ${heading === link.name ? "md:hidden" : "hidden"}
          `}
          >
            {/* sublinks */}
            {categories.map((category) => (
              <div key={category?._id}>
                <div>
                  <Link
                    key={category?._id}
                    to={`/category/${category._id}`}
                    state={{ name: category?.name }}
                    className="flex items-center justify-between py-4 pr-5 font-semibold capitalize pl-7 md:pr-0"
                    onClick={(e) => setOpen(!open)}
                  >
                    {category.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default NavLinks;
