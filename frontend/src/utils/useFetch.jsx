import axios from "axios";
import { useCallback, useEffect, useState } from "react";

const useFetch = (fetchTrigger, url, method, payload) => {
  const [data, setdata] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState({});

  const fetchResponse = useCallback(() => {
    async () => {
      try {
        setloading(true);
        const response = await axios({
          url: url,
          method: method,
          data: payload,
        });
        setdata(response.data);
      } catch (error) {
        seterror(error);
        console.log(error);
      } finally {
        setloading(false);
      }
    };
  }, [payload]);
  
  useEffect(() => {
    fetchResponse();
  }, [fetchTrigger]);

  return { data, loading, error };
};

export default useFetch;
