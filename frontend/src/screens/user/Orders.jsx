import { useEffect} from 'react'
import { useOrdersStore } from '../../store/ordersStore'
import { motion } from 'framer-motion'

import { Navbar, Spinner } from '../../components'
import Footer from '../../components/Footer'
import OrdersTable from './components/OrdersTable'

const Orders = () => {
  const {} = useOrdersStore();
  
  return (
    <>
      <Navbar />

      
      <div className="relative min-h-screen mt-20 overflow-hidden text-white bg-gray-900 font-nunitoSans">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
          </div>
        </div>

        <div className="relative z-10 px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <OrdersTable/>
        </div>
      </div>
     

      <Footer />
    </>
  );
}

export default Orders