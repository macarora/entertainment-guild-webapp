import { Box, Typography, Avatar, Button, Stack, Grid } from "@mui/material";
import useAxios from "../Hooks/useAxios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "../Context/sessionContext";

// page to view the prodcucts from the logged in user-- not tested as there is a backend Issue--not tested--based on Myorder so hoping it will work in a similar way
function ProductListPage() {
  const { getUser } = useAxios(); // to fetch user data -- getUser not working due to backend error so untested
  const [user, setUser] = useState(null); // stores user info
  const [productList, setProductList] = useState([]); // stores product list
  const navigate = useNavigate(); // navigation
  const { userInfo } = useSessionContext();

  useEffect(() => {
    async function fetchData() {
      const userData = await getUser(); //
      // get logged-in user
      const currentUser = userData?.list?.find(
        (user) => user.UserID === userInfo?.userId
      );

      setUser(currentUser || null);
      setProductList(currentUser?.["Product List"] || []);
    }

    fetchData();
  }, []);

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 4,
        p: 3,
      }}
    >
      {/* Avatar with fallback logic */}
      <Avatar alt={user?.Name || "User"} src="/default-avatar.png">
        {user?.Name ? user.Name.charAt(0).toUpperCase() : "?"}
      </Avatar>

      {/* Greeting */}
      <Typography variant="h6" sx={{ mt: 2 }}>
        Hi {user?.Name || user?.Email}
      </Typography>

      {/* Product List block */}
      {productList.length > 0 ? (
        productList.map((product) => (
          <Box key={product.ID} sx={{ p: 2, borderBottom: "1px solid #eee" }}>
            <Typography variant="body1" fontWeight="bold">
              {product.Name}
            </Typography>
            <Typography variant="body2">Product ID: {product.ID}</Typography>
          </Box>
        ))
      ) : (
        <Typography variant="body2" sx={{ mt: 2 }}>
          No products found.
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

export default ProductListPage;
