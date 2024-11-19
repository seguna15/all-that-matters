import React, { useEffect, useState } from "react";
import { Navbar } from "../../components";
import Footer from "../../components/Footer";
import { useCartsStore } from "../../store/cartsStore";
import { motion } from "framer-motion";
import CartItem from "./components/CartItem";
import EmptyCartUI from "./components/EmptyCartUi";
import GiftCouponCard from "./components/GiftCouponCard";
import PeopleAlsoBought from "./components/PeopleAlsoBought";
import useScrollToTop from "../../shared/hooks/useScrollToTop";
import OrderSummary from "./components/OrderSummary"
import { countries} from "../../shared/data/countries";
import { option } from "framer-motion/client";
import { useAuthStore } from "../../store/authStore";
import useShippingAddress from "../../shared/hooks/useShippingAddress";
import ShippingAddress from "./components/ShippingAddress";
import { isEmpty } from "../../shared/validators";

const CheckOutPage = () => {
  const { cart } = useCartsStore();
 
  useScrollToTop();
    
   const {shippingAddress, setShippingAddress, addressLoading} = useShippingAddress()
  
  
  const [useAsShippingAddress, setUseAsShippingAddress] = useState(false);

  
  const countryList = countries.filter(
    (country) =>
      country.name.includes(
        "Canada"
      ) ||
      country.name.includes(
        "Nigeria",
      ) ||
      country.name.includes(
        "United Kingdom",
      ) ||
      country.name.includes(
        "United States"
      )
  );
  
    
  const onCountryChange = (name ) => {
    const foundCountry = countryList.find(country => country.name === name);
    setShippingAddress({
      ...shippingAddress,
      country: {...shippingAddress["country"], value: foundCountry.name},
      phoneCode: {...shippingAddress["phoneCode"], value: foundCountry.dial_code}
    }); 
   
  }

  const onInputChange = (field, value) => {
    setShippingAddress((prevState) => ({
      ...prevState,
      [field]: {
        ...prevState[field],
        value,
        
      },
    }));
    
  };
  
  const  handleInputValidationOnBlur = (value, field) => {
    let isValid = false;

    switch (field) {
      case "firstName":
        isValid = isEmpty(value);
        break;
      case "lastName":
        isValid = isEmpty(value);
        break;
      case "address":
        isValid = isEmpty(value);
        break;
      case "city":
        isValid = isEmpty(value);
        break;
      case "state":
        isValid = isEmpty(value);
        break;
      case "country":
        isValid = isEmpty(value);
        break;
      case "phoneCode":
        isValid = isEmpty(value);
        break;
      case "phoneNumber":
        isValid = isEmpty(value);
        break;
      
      default:
        break;
    }
    
    setShippingAddress((prevState) => ({
      ...prevState,
      [field]: {
        ...prevState[field],
        isValid,
      },
    }));
  };

  const isAddressValid =
    shippingAddress?.firstName?.isValid && shippingAddress?.lastName?.isValid &&
    shippingAddress?.address?.isValid && shippingAddress?.city?.isValid &&
    shippingAddress?.state?.isValid && shippingAddress?.country?.isValid  && shippingAddress?.phoneNumber?.isValid 
    
  console.log(useAsShippingAddress);
  
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
                  <ShippingAddress
                    onCountryChange={onCountryChange}
                    shippingAddress={shippingAddress}
                    setShippingAddress={setShippingAddress}
                    useAsShippingAddress={useAsShippingAddress}
                    setUseAsShippingAddress={setUseAsShippingAddress}
                    countryList={countryList}
                    isAddressValid={isAddressValid}
                    handleInputValidationOnBlur={handleInputValidationOnBlur}
                    onInputChange={onInputChange}
                  />
                )}
              </motion.div>

              {cart.length > 0 && (
                <motion.div
                  className="flex-1 max-w-4xl mx-auto mt-6 space-y-6 lg:mt-0 lg:w-full"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <OrderSummary
                    shippingAddress={shippingAddress}
                    useAsShippingAddress={useAsShippingAddress}
                    isAddressValid={isAddressValid}
                  />
                  <GiftCouponCard />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default CheckOutPage;
