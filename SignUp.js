import * as React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link as RouterLink,
} from "react-router-dom";
import {
  Box,
  FormControl,
  FormGroup,
  TextField,
  Button,
  Typography,
  Grid,
  Link,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { tryAddPatron } from "../Helpers/userHelpers";

// Navigation from SignIn Page to Landing Page - Becasue I dont have a back button planned here so using the Branding Logo to navigate back. Seems a smart thing to do for now.
// Contemplating to add a tooltip so that on hover it provides feedback on what action will happen. Also could be benefical for accessibility. Currenlty no alt text used. Focus on functinality

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

// currently post request dont work without user is logged in-- therefore signup is not working and not really worked on.
const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState("");
  const navigate = useNavigate();

  //Handle submit
  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = (firstName + " " + lastName).trim(); // so the there is sapce between firstname and lastname -- to match the format int he db-- added trim method to avoid space

    try {
      await tryAddPatron(email, name, password, (res) => {
        if (res === "Success") {
          setResult("Account created successfully!");
          setTimeout(() => navigate("/"), 1000); //Navigate to landing page after success
        } else {
          setResult("Signup failed. Try again.");
        }
      });
    } catch (err) {
      console.error(err);
      setResult("Signup failed. Try again.");
    }
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
          maxWidth: 450,
          p: 4,
          border: "0.25px solid lightgrey",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Tooltip title="Go To Home Page">
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            {BRANDING.logo}
          </Box>
        </Tooltip>

        <Typography variant="h4" component="h1" align="center">
          Sign Up
        </Typography>

        {/* First Name & Last Name in a FormGroup with row direction */}
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth>
            <Grid sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <TextField
                id="firstName"
                label="First Name"
                variant="outlined"
                required
                fullWidth
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField
                id="lastName"
                label="Last Name"
                variant="outlined"
                fullWidth
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Grid>
          </FormControl>

          {/* Email in its own FormControl for consistent spacing */}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <TextField
              type="email"
              id="email"
              label="Email"
              variant="outlined"
              required
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <TextField
              type="password"
              id="password"
              label="Password"
              variant="outlined"
              required
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}>
            <Button type="submit" variant="contained" fullWidth>
              Submit
            </Button>
            <Link
              component={RouterLink}
              to="/signin"
              variant="body2"
              sx={{ color: "primary.main" }}
              underline="hover"
              align="center"
            >
              Already have an account? Sign In
            </Link>
          </Box>
        </form>

        {result && (
          <Typography
            variant="body2"
            align="center"
            sx={{
              color:
                result === "Account created successfully!"
                  ? "secondary.main"
                  : "error.main",
              mt: 1,
            }}
          >
            {result}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default SignUp;
