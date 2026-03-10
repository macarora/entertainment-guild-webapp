import { useState, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";

import Banner from "../Components/Banner";
import TopPromoLineComponent from "./TopPromoLineComponent";
import AppPagination from "./AppPagination";
import useAxios from "../Hooks/useAxios";

// reusable landing page
const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { getMergedData } = useAxios();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productList = await getMergedData();

        setProducts(productList);
      } catch (error) {
        console.error("There is an error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts(); // removed isLoading check since Auth0 is gone , keycloak is gone!!!
  }, []); // trying from the YouTube video and slides — more modular approach

  return (
    <Box>
      {/*Added Box to fix the Promoline placement*/}
      <Banner />

      <TopPromoLineComponent />

      {/*Passing path prop so that AppPagination can be modular — for each page just need to change the /product to /bookgenre etc*/}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <AppPagination path="/product" items={products} sx={{ mr: 3 }} />
      )}
    </Box>
  );
};

export default LandingPage;
