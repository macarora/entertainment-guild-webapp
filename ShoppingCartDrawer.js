import * as React from "react";
import {
  Box,
  IconButton,
  Badge,
  Typography,
  Drawer,
  Button,
  Stack,
  Grid,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useState } from "react";
import useToggle from "../Hooks/useToggle";
import { useMyCartContext } from "../Context/Context";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

//ShoppingCartDrawer Component
export default function ShoppingCartDrawer({ userInfo }) {
  const { open, toggleDrawer } = useToggle(false);
  const { cart, setCart } = useMyCartContext();

  //total cart items used for the badge
  const totalItems = cart.reduce(totalOfCartItems, 0);

  function totalOfCartItems(accumulator, item) {
    return accumulator + item.quantity;
  } // totaling the items in the cart

  const totalPrice = cart.reduce(totalCartPrice, 0);

  // total cart price
  function totalCartPrice(sum, item) {
    const quantity = item.quantity || 1;
    const price = item.Price || 0;
    return sum + quantity * price;
  }

  const roundTotalPrice = totalPrice.toFixed(2); // for 2 decimal points

  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    if (cart.length === 0) {
      alert("Your Cart is Empty");
      return;
    }
    toggleDrawer(false)();
    navigate(`/checkout`);
    console.log("Checkout clicked");
  };

  //item is passed as prop and citem is the temp value to check the item in the cart
  function handleAddToCart(item) {
    const carItemExisting = cart.find((citem) => citem.ID === item.ID);

    if (carItemExisting) {
      const updatedCart = cart.map((citem) =>
        citem.ID === item.ID
          ? { ...citem, quantity: citem.quantity + 1 } // add item
          : citem
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...item, quantity: 1 }]); // setting the quantity of the product and initialising it with 1
    }
  }

  // resued from product description just changed to citem so it is looking to cart items and checking the item id
  function handleRemoveFromCart(item) {
    const cartItemExisting = cart.find((citem) => citem.ID === item.ID);

    if (cartItemExisting.quantity > 1) {
      const updatedCart = cart.map((citem) =>
        citem.ID === item.ID
          ? { ...citem, quantity: citem.quantity - 1 } // reduce item
          : citem
      );
      setCart(updatedCart);
    } else {
      const updatedCart = cart.filter((citem) => citem.ID !== item.ID);
      setCart(updatedCart); // remove item completely if quantity hits 0
    }
  }

  const cartContent =
    cart.length > 0 ? (
      <Box>
        {/*Condition checking is name is avaiable then use name-- most likely will be email since i am using email for patron login. Guest is for when patron is not logged in */}
        <Typography variant="h6" sx={{ p: 2 }}>
          Hi {userInfo?.name ? `${userInfo.name}` : "Guest"} This is Your
          Shopping Cart
        </Typography>

        {cart.map((item) => (
          <Stack key={item.ID}>
            <Box sx={{ p: 2, borderBottom: "1px solid #eee" }}>
              {/*using Grid so that item details are palced next to add and delete button */}
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid item>
                  <Typography variant="body1" fontWeight="bold">
                    {item.Name} × {item.quantity || 1}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.Author}
                  </Typography>
                  <Typography variant="body2">${item.Price}</Typography>
                </Grid>
                <Grid item>
                  {/*Add Button */}
                  <IconButton>
                    <AddIcon
                      onClick={() => handleAddToCart(item)}
                      color="primary"
                    />
                  </IconButton>
                  {/*Delete Button */}
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveFromCart(item)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          </Stack>
        ))}

        <Typography variant="h5" fontWeight="bold">
          Total : ${roundTotalPrice}
        </Typography>
      </Box>
    ) : (
      <Typography sx={{ p: 2, color: "text.secondary" }}>
        Hi {userInfo?.name ? `${userInfo.name}` : "Guest"} Your cart is empty.
      </Typography>
    );

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <IconButton onClick={toggleDrawer(true)} sx={{ mr: 2 }}>
        <Badge badgeContent={totalItems} color="secondary">
          <ShoppingCartIcon
            sx={{ cursor: "pointer", "&:hover": { color: "primary.main" } }}
          />
        </Badge>
      </IconButton>

      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 500,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {cartContent}

          <Box
            display="flex"
            sx={{ mt: 2 }}
            justifyContent="center"
            position="static" //changed from absolute to static so that the button moves witht he products added to checkout.
            width="100%"
            bottom="0"
            paddingBottom="20px"
          >
            <Button
              onClick={handleCheckoutClick}
              variant="contained"
              sx={{ width: "75%" }}
            >
              {" "}
              Check out
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
