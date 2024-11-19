import React from 'react'
import { Navbar } from '../../components';
import Footer from '../../components/Footer';
import { useCartsStore } from '../../store/cartsStore';
import { motion } from 'framer-motion';
import CartItem from './components/CartItem';
import EmptyCartUI from './components/EmptyCartUi';

import PeopleAlsoBought from './components/PeopleAlsoBought';
import useScrollToTop from '../../shared/hooks/useScrollToTop';
import CartSummary from './components/CartSummary';


const Cart = () => {

    const { cart } = useCartsStore();
    useScrollToTop();
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen mt-20 overflow-hidden text-white bg-gray-900 font-nunitoSans">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
          </div>
        </div>

        <div className="py-8 md:py-16">
          <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
            <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
              <motion.div
                className="flex-none w-full mx-auto lg:max-w-2xl xl:max-w-4xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {cart.length === 0 ? (
                  <EmptyCartUI />
                ) : (
                  <div className="space-y-6">
                    {cart.map((item) => (
                      <CartItem key={item._id} item={item} />
                    ))}
                  </div>
                )}
                {cart.length > 0 && <PeopleAlsoBought />}
              </motion.div>

              {cart.length > 0 && (
                <motion.div
                  className="flex-1 max-w-4xl mx-auto mt-6 space-y-6 lg:mt-0 lg:w-full"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <CartSummary />
                  
                </motion.div>
              )}
            </div>
          </div>
        </div>

        
      </main>

      <Footer />
    </>
  );
}

export default Cart

