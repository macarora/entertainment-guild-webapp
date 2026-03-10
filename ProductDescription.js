import { Box, Button, Typography, Skeleton } from "@mui/material";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import useToggle from "../Hooks/useToggle";
import ShoppingCartDrawer from "./ShoppingCartDrawer";
import useAxios from "../Hooks/useAxios";
import { useMyCartContext } from "../Context/Context";

// to navigate to the related product description - stack overflow
function ProductDescription() {
  const { open, toggleDrawer } = useToggle(false);
  const [product, setProduct] = useState({});
  const { getMergedData } = useAxios();
  const { cart, setCart } = useMyCartContext();

  // had to use id instead of ID as id is used in the Route!!! AHHHHHHHHHHHH!!!!
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const mergedProductsList = await getMergedData();
        const singleProduct = mergedProductsList.find(
          (item) => item.ID === parseInt(id)
        );

        setProduct(singleProduct);
      } catch (error) {
        console.error("There is an error", error);
      }
    };

    fetchProduct();
  }, [id]);

  //Add to Cart-- also for -- shoppingcartdrawer
  function handleAddToCart() {
    const carItemExisting = cart.find((item) => item.ID === product.ID);

    if (carItemExisting) {
      const updatedCart = cart.map((item) =>
        item.ID === product.ID ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]); // setting the quantity of the product and initialising it with 1
    }
  }

  //Remove from Cart-- also for -- shoppingcartdrawer
  function handleRemoveFromCart() {
    const carItemExisting = cart.find((item) => item.ID === product.ID);

    if (carItemExisting.quantity > 1) {
      const updatedCart = cart.map((item) =>
        item.ID === product.ID ? { ...item, quantity: item.quantity - 1 } : item
      );
      setCart(updatedCart);
    } else {
      const updatedCart = cart.filter((item) => item.ID !== product.ID);
      setCart(updatedCart); // setting the quantity of the product when 0
    }
  }

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="center"
      alignItems="flex-start"
      gap={4}
      sx={{ padding: 2 }}
    >
      {/* Image block with skeleton */}
      {product.image ? (
        <Box
          component="img"
          src={product.image}
          alt={product.Name}
          sx={{
            width: 500,
            height: 500,
            objectFit: "cover",
            borderRadius: 2,
          }}
        />
      ) : (
        <Skeleton
          variant="rectangular"
          width={500}
          height={500}
          animation="wave"
          sx={{ borderRadius: 2 }}
        />
      )}

      {/*Product Info Block */}
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        sx={{
          height: 500,
          width: 400,
        }}
      >
        <Typography variant="h4" gutterBottom>
          {product.Name}
        </Typography>
        <Typography variant="h4" gutterBottom>
          {product.Author}
        </Typography>
        <Typography
          variant="body1"
          gutterBottom
          sx={{
            height: 410, // adjusted height to match the button placement
            overflowY: "auto",
          }}
        >
          {product.Description}
        </Typography>

        <Box>
          <Typography variant="h4">${product.Price}</Typography>

          <Button
            variant="contained"
            onClick={handleAddToCart}
            sx={{ mt: 2, mr: 6 }}
          >
            Add to Cart
          </Button>
          {cart.some((item) => item.ID === product.ID) && (
            <Button
              variant="contained"
              color="error"
              onClick={handleRemoveFromCart}
              sx={{ mt: 2 }}
            >
              Remove
            </Button>
          )}
        </Box>
      </Box>
      <Box></Box>
    </Box>
  );
}

export default ProductDescription;
