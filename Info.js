import * as React from "react";
import PropTypes from "prop-types";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { useMyCartContext } from "../Context/Context";
import Box from "@mui/material/Box";

// from MUI
function Info() {
  const { cart } = useMyCartContext();

  // for info on the side bar
  const totalPriceFromCart = cart.reduce(totalCartPrice, 0);

  function totalCartPrice(sum, item) {
    if (item.quantity >= 1) {
      return sum + item.quantity * item.Price;
    } else {
      return sum;
    }
  }

  const roundTotalPrice = totalPriceFromCart.toFixed(2); // for 2 decimal points

  return (
    <Box>
      <List disablePadding>
        {cart.map((item) => (
          <ListItem key={item.ID} sx={{ p: 2, borderBottom: "1px solid #eee" }}>
            <Box>
              <Typography variant="body1" fontWeight="bold">
                {item.Name} × {item.quantity || 1}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.Author}
              </Typography>
              <Typography variant="body2">${item.Price}</Typography>
            </Box>
          </ListItem>
        ))}
      </List>
      <Typography variant="h5" fontWeight="bold">
        Total : ${roundTotalPrice}
      </Typography>
    </Box>
  );
}

export default Info;
