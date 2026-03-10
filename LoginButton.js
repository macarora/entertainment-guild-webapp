import { IconButton } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import React from "react";
import { useNavigate } from "react-router-dom";

// login button navigating to SignIn and SignUp
const LoginButton = () => {
  const navigate = useNavigate();

  const handleNavigateToLogin = () => {
    navigate("/signin");
  };

  return (
    <IconButton color="inherit" onClick={handleNavigateToLogin}>
      <PersonIcon
        fontSize="medium"
        sx={{
          cursor: "pointer",
          "&:hover": { color: "secondary.main" },
        }}
      />
    </IconButton>
  );
};

export default LoginButton;
