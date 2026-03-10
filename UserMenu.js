import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import useAxios from "../Hooks/useAxios";
import { useSessionContext } from "../Context/sessionContext";

//UserMenu Component --- from MUI
function UserMenu({}) {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate();
  const { postLogOut } = useAxios();
  const { userInfo, setUserInfo, setIsAuthenticated, logout } =
    useSessionContext();

  // conditional render for my orders
  const isAdmin = userInfo?.isAdmin;
  const settings = isAdmin
    ? ["Profile", "Product List", "Sign Out"]
    : ["Profile", "My Orders", "Sign Out"];

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // sign out
  const handleSignOut = async () => {
    try {
      const res = await postLogOut();
      console.log("Logged Out", res);
    } catch (error) {
      console.warn("Logout failed:", error.message);
    }

    logout();
    console.log("Signout successfully ");
    navigate("/");
  };

  // navigate to profile
  const handleProfile = async () => {
    console.log("Profile Page ");
    navigate("/profile");
  };

  const handleProductList = async () => {
    console.log("Profile Page ");
    navigate("/productlist");
  };

  // navigate to my orders
  const handleMyOrders = async () => {
    console.log("Profile Page ");
    navigate("/myorders");
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt={userInfo?.name || "User"} src="/default-avatar.png">
            {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : "?"}
          </Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {settings.map((setting) => (
          <MenuItem
            key={setting}
            onClick={() => {
              handleCloseUserMenu();
              if (setting === "Sign Out") handleSignOut();
              if (setting === "Profile") handleProfile();
              if (setting === "Product List") handleProductList();
              if (setting === "My Orders") handleMyOrders();
            }}
          >
            <Typography sx={{ textAlign: "center" }}>{setting}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

export default UserMenu;
