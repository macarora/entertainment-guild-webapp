import React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Menu,
  Container,
  Button,
  Tooltip,
  MenuItem,
  Stack,
  IconButton,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import ShoppingCartDrawer from "./ShoppingCartDrawer";
import { useState } from "react";
import SearchBar from "./SearchBar";
import SearchResultsList from "./SearchResultsList";
import LoginButton from "./LoginButton";
import UserMenu from "./UserMenu";
import { useMyCartContext } from "../Context/Context";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "../Context/sessionContext";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import useMode from "../Hooks/useMode";
import egTheme from "../UI/Theme";

//for patron view
const genres = ["Books", "Movies", "Games"];

//for employee/admin view (kept for future use if backend adds roles)
const adminpages = ["Products", "Stocks", "Patrons", "Users", "Orders"];

/**
 * The Appbar component with a desktop-only design and integrated search bar.-- from mui
 */
function ResponsiveAppBar({ setGenChoice, setChoice, mode, toggleMode }) {
  const [results, setResults] = useState([]); // for search bar - value input
  const [query, setQuery] = useState(""); // to clear search onClick
  const { userInfo, isAuthenticated } = useSessionContext();
  const theme = egTheme(mode); // for dark and light mode

  // used for conditional rendering of the Users page based onthe IsAdmin = true or fasle for employee -- untested as cannot create and authenticate employee
  const isAdmin = userInfo?.isAdmin === true;

  const adminpages = isAdmin
    ? ["Products", "Stocks", "Patrons", "Users", "Orders"]
    : ["Products", "Stocks", "Patrons", "Orders"]; //--untested as have only User cred... unable to post new cred

  const navigate = useNavigate();
  console.log("AppBar session state:", { isAuthenticated, userInfo });

  return (
    <AppBar
      position="sticky" // changed from static to sticky after 11yr old tested my app and gave suggestions
      elevation={0}
      sx={{
        backgroundColor:
          mode === "light" ? "#ffffff" : theme.palette.background.paper,
        color:
          mode === "light"
            ? theme.palette.primary.main
            : theme.palette.primary.contrastText,
      }} // for dark and light mode calling the values form my theme
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link
            to={
              !isAuthenticated || userInfo?.name?.includes("@")
                ? "/"
                : "/storemanagementdash"
            }
            style={{ textDecoration: "none" }}
          >
            <img
              src="/EgLogo.png"
              alt="Company Logo"
              style={{ marginRight: "8px", height: "40px" }}
            />
          </Link>

          {/* Using the logo on top as a navigation tool to landing page. It is a standard practise for websites so using it here as well and not planning to have a back button.*/}
          <Link
            to={
              !isAuthenticated || userInfo?.name?.includes("@")
                ? "/"
                : "/storemanagementdash"
            }
            style={{ textDecoration: "none" }}
          >
            <Tooltip title="Go To Home Page">
              <Typography
                variant="h6"
                noWrap
                sx={{
                  mr: 2,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color:
                    mode === "light"
                      ? theme.palette.primary.main
                      : theme.palette.primary.contrastText,

                  "&:hover": {
                    color:
                      mode === "light"
                        ? theme.palette.success.main
                        : theme.palette.secondary.main,
                  },

                  textDecoration: "none",
                }} // for dark and light mode calling the values form my theme -- had to add here as the text color was hard coded.
              >
                ENTERTAINMENT GUILD
              </Typography>
            </Tooltip>
          </Link>

          {/* navigation links with conditional rendering */}
          <Box sx={{ flexGrow: 1, display: "flex" }}>
            {!isAuthenticated || userInfo?.name?.includes("@") ? (
              <Box sx={{ flexGrow: 1, display: "flex" }}>
                {/* Patron Menu */}
                {genres.map((genre) => (
                  <Button
                    key={genre}
                    sx={{ my: 2, color: "inherit", display: "block" }}
                    onClick={() => {
                      if (genre === "Books") setGenChoice("book");
                      if (genre === "Movies") setGenChoice("movies");
                      if (genre === "Games") setGenChoice("games");
                      navigate("/genre");
                    }}
                  >
                    {genre}
                  </Button>
                ))}
              </Box>
            ) : (
              <Box sx={{ flexGrow: 1, display: "flex" }}>
                {/* Admin Menu  */}
                {adminpages.map((adminpage) => (
                  <Button
                    key={adminpage}
                    sx={{ my: 2, color: "inherit", display: "block" }}
                    onClick={() => {
                      if (adminpage === "Products") setChoice("products");
                      if (adminpage === "Stocks") setChoice("stock");
                      if (adminpage === "Patrons") setChoice("patrons");
                      if (adminpage === "Users") setChoice("users");
                      if (adminpage === "Orders") setChoice("order");
                    }}
                  >
                    {adminpage}
                  </Button>
                ))}
              </Box>
            )}
          </Box>

          {/* Search bar conditional rendering */}
          <Box>
            {(!isAuthenticated || userInfo?.name?.includes("@")) && (
              <Stack sx={{ position: "relative" }}>
                <SearchBar
                  setResults={setResults}
                  setQuery={setQuery}
                  query={query}
                />
                {results.length > 0 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      maxHeight: 250,
                      overflowY: "auto",
                      bgcolor: "background.paper",
                      boxShadow: 3,
                      borderRadius: 1,
                      mt: 1,
                      zIndex: 1500,
                      fontFamily: "inherit",
                      typography: "body1",
                    }}
                  >
                    <SearchResultsList
                      results={results}
                      clearSearch={() => {
                        setQuery("");
                        setResults([]);
                      }}
                    />
                  </Box>
                )}
              </Stack>
            )}
          </Box>

          {/*Login conditional rendering based on the user login*/}
          <Box sx={{ whiteSpace: "nowrap", mr: 5 }}>
            {!isAuthenticated ? <LoginButton /> : <UserMenu />}
          </Box>

          {/* Shopping cart Icon with conditional rendering */}
          <Box>
            {(!isAuthenticated || userInfo?.name?.includes("@")) && (
              <ShoppingCartDrawer userInfo={userInfo} />
            )}
          </Box>
          <Box>
            {/*based on shopping cart icon and shopping drawer */}
            <IconButton
              sx={{
                cursor: "pointer",
                "&:hover": { color: "error.main" },
              }}
              onClick={toggleMode}
            >
              {/*logic to handle the dark and light mode based on coditional rendering */}
              {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
