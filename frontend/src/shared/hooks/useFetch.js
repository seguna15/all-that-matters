import { useEffect, useState } from "react";
import { apiClient } from "../../api";
import toast from "react-hot-toast";

export default function useFetch(endpoint, id, payload) {
  
    const [data, setData] = useState(null);
    const [isFetchLoading, setIsFetchLoading] = useState(false);

    const  getData = async (endpoint, id, payload) =>  {
      try {
        setIsFetchLoading(true);
        const {data} = await apiClient.get(`${endpoint}/${id}`);
        
        setData(data[payload]);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Oops we could not fetch brand"
        );
      } finally {
        setIsFetchLoading(false);
      }
    }

    useEffect(() => {
        getData(endpoint, id, payload);
    }, [id]);

  return { data, setData, isFetchLoading };
}
