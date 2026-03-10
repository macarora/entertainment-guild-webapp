import * as React from "react";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useMyCartContext } from "../Context/Context";

//cart context created to update the state of cart
export default function Review({ addressDetails, paymentDetails }) {
  const { cart } = useMyCartContext();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // for totalprice
  const totalPriceFromCart = cart.reduce((sum, item) => {
    if (item.quantity >= 1) {
      return sum + item.quantity * item.Price;
    } else {
      return sum;
    }
  }, 0);

  // shipping cost from mui example not required
  const shippingCost = 9.99;
  const roundTotalPrice = totalPriceFromCart.toFixed(2);
  const finalTotal = (totalPriceFromCart + shippingCost).toFixed(2);

  const addresses = [
    addressDetails.address1,
    addressDetails.address2,
    addressDetails.city,
    addressDetails.state,
    addressDetails.zip,
    addressDetails.country,
  ];
  const payments = [
    { name: "Card holder:", detail: paymentDetails.cardName },
    { name: "Card number:", detail: paymentDetails.cardNumber },
    { name: "Expiry date:", detail: paymentDetails.expiryDate },
  ];

  return (
    <Stack spacing={2}>
      <List disablePadding>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText
            primary="Products"
            secondary={`${totalItems} selected`}
          />
          <Typography variant="body2">${roundTotalPrice}</Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Shipping" secondary="Plus taxes" />
          <Typography variant="body2">${shippingCost.toFixed(2)}</Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            ${finalTotal}
          </Typography>
        </ListItem>
      </List>
      <Divider />
      <Stack
        direction="column"
        divider={<Divider flexItem />}
        spacing={2}
        sx={{ my: 2 }}
      >
        <div>
          <Typography variant="subtitle2" gutterBottom>
            Shipment details
          </Typography>
          <Typography gutterBottom>John Smith</Typography>
          <Typography gutterBottom sx={{ color: "text.secondary" }}>
            {addresses.join(", ")}
          </Typography>
        </div>
        <div>
          <Typography variant="subtitle2" gutterBottom>
            Payment details
          </Typography>

          <Grid container>
            {payments.map((payment) => (
              <React.Fragment key={payment.name}>
                <Stack
                  direction="row"
                  spacing={1}
                  useFlexGap
                  sx={{ width: "100%", mb: 1 }}
                >
                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    {payment.name}
                  </Typography>
                  <Typography variant="body2">{payment.detail}</Typography>
                </Stack>
              </React.Fragment>
            ))}
          </Grid>
        </div>
      </Stack>
    </Stack>
  );
}
