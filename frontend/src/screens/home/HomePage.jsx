import React, { useEffect } from 'react'
import { motion } from "framer-motion";
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { div } from 'framer-motion/client';
import { CategoryItem } from '../../components';


const categories = [
  { href: "/jeans", name: "Jeans", imageUrl: "/jeans.jpg" },
  { href: "/t-shirts", name: "T-shirts", imageUrl: "/tshirts.jpg" },
  { href: "/shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
  { href: "/glasses", name: "Glasses", imageUrl: "/glasses.png" },
  { href: "/jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
  { href: "/suits", name: "Suits", imageUrl: "/suits.jpg" },
  { href: "/bags", name: "Bags", imageUrl: "/bags.jpg" },
];

const HomePage = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate()
    
  

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div className="relative z-10 px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h1 className="mb-4 text-5xl font-bold text-center sm:text-6xl text-emerald-400">
          Explore Our Categories
        </h1>
        <p className="mb-12 text-xl text-center text-gray-300">
          Discover the best agricultural and food products from Nigeria
        </p>
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryItem category={category} key={category.name} />
          ))}
        </section>
      </div>
    </div>
  );
}

export default HomePage