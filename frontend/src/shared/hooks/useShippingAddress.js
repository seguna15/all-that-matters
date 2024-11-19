import { useEffect, useState } from "react";
import { apiClient } from "../../api";
import toast from "react-hot-toast";

export default function useShippingAddress() {
  
    const [addressLoading, setAddressLoading] = useState(false);
    const [shippingAddress, setShippingAddress] = useState({
      firstName: {
        value: "",
        isValid : false,
      },  
      lastName: {
        value: "",
        isValid : false,
      },   
      address: {
        value: "",
        isValid : false,
      },
      city: {
        value: "",
        isValid : false,
      },
      state: {
        value: "",
        isValid : false,
      },
      country: {
        value: "",
        isValid : false,
      },
      
      phoneCode: {
        value: "",
        isValid : false,
      },
      phoneNumber: {
        value:  "",
        isValid : false,
      },
      
      zipCode: {
        value: "",
        isValid : false,
      }  
    });

    const  getData = async () =>  {
        setAddressLoading(true)
        try {
          const {data} = await apiClient.get("/users/get-user-profile");
          const shippingAddress = data?.user?.shippingAddress;
          setShippingAddress({
            firstName: {
              value: shippingAddress.firstName,
              isValid: shippingAddress.firstName === "",
            },
            lastName: {
              value: shippingAddress.lastName,
              isValid: !shippingAddress.lastName === "",
            },
            address: {
              value: shippingAddress.address,
              isValid: !shippingAddress.address === "",
            },
            city: {
              value: shippingAddress.city,
              isValid: !shippingAddress.city === "",
            },
            state: {
              value: shippingAddress.state,
              isValid: !shippingAddress.state === "",
            },
            country: {
              value: shippingAddress.country,
              isValid: !shippingAddress.country === "",
            },
            phoneCode: {
              value: shippingAddress?.phoneCode,
              isValid: !shippingAddress.phoneCode === "",
            },
            phoneNumber: {
              value: shippingAddress?.phoneNumber,
              isValid: !shippingAddress.phoneNumber === "",
            },
            zipCode: {
              value: shippingAddress.zipCode,
              isValid: !shippingAddress.zipCode === "",
            },
          });
          setAddressLoading(false);
        } catch (error) {
          setAddressLoading(false)
          toast.error(error.response.data.message || "Error fetching address");
        }
    }

    useEffect(() => {
        getData();
    }, []);

  return { shippingAddress, setShippingAddress, addressLoading };
}
