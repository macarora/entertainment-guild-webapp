import * as React from "react";
import {
  Box,
  FormControl,
  TextField,
  Button,
  Typography,
  Grid,
  Link,
  Tooltip,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { tryLoginUser, tryLoginPatron } from "../Helpers/userHelpers";

import { useSessionContext } from "../Context/sessionContext";
//logo used to navigate back
const BRANDING = {
  logo: (
    <Link component={RouterLink} to="/">
      <Box
        component="img"
        src="/EgLogo.png"
        alt="Your Logo"
        sx={{ height: 100, width: 100 }}
      />
    </Link>
  ),
};

//SignIn Component
const SignIn = ({ setIsAuthenticated, setUserInfo }) => {
  const [username, setUsername] = useState(""); // can be email or admin username
  const [password, setPassword] = useState("");
  const [result, setResult] = useState("");
  const navigate = useNavigate();
  const { login } = useSessionContext();

  // using TryLoginUser from lab abd built TryPatronLogin(Post request not required for the Patron login using get request to match and allow user login-- Special Mention and Thanks to NICK!!--helped me understand what i was doing wrong)
  // Signle SignIn is handeling user and patron login. why?? - i dont like the setup that uni has and from expereince exposing and asking users whether they are staff or patron is not great!!!
  const handleSubmit = async (event) => {
    event.preventDefault();
    setResult("");
    // for User
    const userResponse = await tryLoginUser(username, password, setResult);

    if (userResponse) {
      login({
        userId: userResponse.id,
        name: userResponse.username,
        isAdmin: userResponse.isAdmin,
      });
      console.log("User Login", userResponse);
      navigate("/storemanagementdash");

      return;
    }
    // for Patron
    const patronResponse = await tryLoginPatron(username, password, setResult);

    if (patronResponse) {
      login({
        userId: patronResponse.userId,
        name: patronResponse.email,
      });
      console.log("Patron Login");
      navigate("/");

      return;
    }

    setResult("Login failed. Please check your credentials.");
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Box
        sx={{
          minWidth: 450,
          p: 4,
          border: "0.25px solid lightgrey",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/*Logo used ot navigate back to home page -- added tool tip for feedabck to the user/patron*/}
        <Tooltip title="Go To Home Page">
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            {BRANDING.logo}
          </Box>
        </Tooltip>

        <Typography variant="h4" component="h1" align="center">
          Sign In
        </Typography>

        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              type="text"
              id="username"
              label="Email or Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              type="password"
              id="password"
              label="Password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
          </FormControl>

          <Button type="submit" variant="contained" fullWidth>
            Submit
          </Button>

          <Grid container justifyContent="space-between" sx={{ mt: 1 }}>
            <Link
              href="#"
              variant="body2"
              sx={{ color: "error.main" }}
              underline="hover"
            >
              Digitally dependent Forgot Password
            </Link>

            <Link
              component={RouterLink}
              to="/signup"
              variant="body2"
              sx={{ color: "primary.main" }}
              underline="hover"
            >
              Need to Sign Up
            </Link>
          </Grid>
        </form>

        {result && (
          <Typography
            variant="body2"
            align="center"
            sx={{
              color: result === "Success!" ? "secondary.main" : "error.main",
              mt: 1,
            }}
          >
            {result === "Success!" ? "Login successful!" : result}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default SignIn;
