import { useState, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import AppPagination from "./AppPagination";
import useAxios from "../Hooks/useAxios";

// using it like a category page. navigating to the products with the specific genre
const GenrePage = ({ genchoice }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { getProductPageWithGenre, getMergedData } = useAxios();

  useEffect(() => {
    const fetchProductsWithGenre = async () => {
      setLoading(true);
      try {
        //
        const genresponse = await getProductPageWithGenre();
        const stockresponse = await getMergedData();

        // merge by matching product ID
        const merged = genresponse.map((product) => {
          const stock = stockresponse.find((s) => s.ItemId === product.ID);
          return {
            ...product,

            Price: stock ? stock.Price : 0,
            Quantity: stock ? stock.Quantity : 0,
          };
        });
        // declaring an empty array
        let filtered = [];

        if (genchoice === "book") {
          filtered = merged.filter(
            (item) =>
              item.GenreName?.toLowerCase() === "book" ||
              item.GenreName?.toLowerCase() === "books"
          );
          console.log("book", filtered);
        } else if (genchoice === "movies") {
          filtered = merged.filter(
            (item) => item.GenreName?.toLowerCase() === "movies"
          );
          console.log("movies", filtered);
        } else if (genchoice === "games") {
          filtered = merged.filter(
            (item) => item.GenreName?.toLowerCase() === "games"
          );
          console.log("games", filtered);
        }

        setProducts(filtered);
      } catch (error) {
        console.error("There is an error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsWithGenre();
  }, [genchoice]);

  return (
    <Box>
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

export default GenrePage;
