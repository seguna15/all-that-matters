import { ShoppingBag } from 'lucide-react';
import React from 'react'
import HeroPng from "../../../assets/foodstuff.png";
import LeafPng from "../../../assets/leaf.png";
import { motion } from 'framer-motion';
import { FadeUp, FadeLeft, FadeRight } from '../../../shared/utils/animation';
import AnchorLink from "react-anchor-link-smooth-scroll";


const Hero = () => {
  return (
    <section>
      <div className="grid container grid-cols-1 md:grid-cols-2 min-h-[650px] relative ">
        <div className="relative z-10 flex flex-col justify-center py-1 md:py-o">
          <div className="text-center md:text-left space-y-6 lg:max-w-[400px]">
            <motion.h1
              variants={FadeRight(0.5)}
              initial="hidden"
              animate="visible"
              className="text-5xl font-bold leading-relaxed lg:text-6xl xl:leading-loose "
            >
              All That <br />
              Matters <span className="text-yellow-400">Foods</span>
            </motion.h1>
            <motion.p
              variants={FadeRight(0.9)}
              initial="hidden"
              animate="visible"
              className="text-2xl tracking-wide"
            >
              Order now for fresh food items
            </motion.p>
            <motion.p
              variants={FadeRight(1.2)}
              initial="hidden"
              animate="visible"
              className="text-gray-300"
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Distinctio, ex voluptas. Assumenda atque, nulla repudiandae nihil
              quo ab nesciunt officiis?
            </motion.p>
            <motion.div
              variants={FadeRight(1.5)}
              initial="hidden"
              animate="visible"
              className="flex justify-center md:justify-start"
            >
              <AnchorLink
                href="#featured-products"
                className="flex items-center gap-2 primary-btn"
              >
                <ShoppingBag /> Order Now
              </AnchorLink>
            </motion.div>
          </div>
        </div>
        <div className="flex items-center justify-center ">
          <motion.img
            initial={{ opacity: 0, x: 200, rotate: 75 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            src={HeroPng}
            alt="hero-image"
            className="w-[350px] md:w-[550px] mt-10 drop-shadow rounded-full"
          />
        </div>
        <div className="absolute top-14 md-top-0 right-1/2 blur-sm opacity-80 rotate-[40deg]">
          <motion.img
            initial={{ opacity: 0, y: -200, rotate: 75 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            src={LeafPng}
            className="w-full md:max-w-[300px]"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero