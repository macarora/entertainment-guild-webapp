import { Box, Typography, Avatar, Button, Stack, Grid } from "@mui/material";
import useAxios from "../Hooks/useAxios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "../Context/sessionContext";

function MyOrdersPage() {
  const { getPatron, getCustomerOrders } = useAxios(); //  hook to get patron and orders
  const [patron, setPatron] = useState(null); // stores patron info
  const [orders, setOrders] = useState([]); // stores orders list
  const navigate = useNavigate(); // navigation for back
  const { userInfo, isAuthenticated } = useSessionContext();

  // used to get the orders from the nested array - TO List
  useEffect(() => {
    async function fetchData() {
      if (!isAuthenticated) {
        return;
      }
      const userData = await getPatron();
      const patronId = userData?.list
        // flaten the array using flatMap then look for patronId and retuent he patron Id and the dispaly the orders of the patronId
        ?.flatMap((user) => user["TO List"] || [])
        ?.find((to) => to.PatronId)?.PatronId;
      const orderData = await getCustomerOrders(patronId);

      //checking if its an array and then returnign an array
      const allOrders = Array.isArray(orderData)
        ? orderData
        : orderData?.list || orderData?.data?.list || [];

      const matchedOrders = Array.isArray(allOrders)
        ? allOrders.filter(
            (order) => String(order?.TO?.PatronId) === String(patronId)
          )
        : [];

      setPatron(userData?.list?.[0] || null);
      setOrders(matchedOrders);
    }

    fetchData();
  }, [isAuthenticated, userInfo]);

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 4,
        p: 3,
      }}
    >
      {/* Avatar with fallback logic for initials or "?" */}
      <Avatar alt={patron?.Name || "User"} src="/default-avatar.png">
        {patron?.Name ? patron.Name.charAt(0).toUpperCase() : "?"}
      </Avatar>

      {/* Greeting  */}
      <Typography variant="h6" sx={{ mt: 2 }}>
        Hi {patron?.Name || patron?.Email}
      </Typography>

      {/* Orders block -- loop thorugh all the orders -- no quantity as the pay load dosent show order quantity-- using same style as in shoppingcartdrawer*/}
      {orders.length > 0 ? (
        orders.map((order) => (
          <Stack key={order.OrderID} sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Order #{order.OrderID}
            </Typography>

            {(order.StocktakeList || []).map((item) => (
              <Box key={item} sx={{ p: 2, borderBottom: "1px solid #eee" }}>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Grid item>
                    <Typography variant="body1" fontWeight="bold">
                      {item.ProductName}
                    </Typography>

                    <Typography variant="body2">${item.Price}</Typography>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Stack>
        ))
      ) : (
        <Typography variant="body2" sx={{ mt: 2 }}>
          No orders found.
        </Typography>
      )}

      {/* Back button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button variant="contained" color="error" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Box>
    </Box>
  );
}

export default MyOrdersPage;
