import { Box, Container } from "@mui/material";
import ResponsiveAppBar from "./Components/ResponsiveAppBar";
import LandingPage from "./Components/LandingPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductDescription from "./Components/ProductDescription";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import { useLocation } from "react-router";
import StoreMangementDash from "./Components/StoreMangementDash";
import CheckUser from "./Components/CheckUser";
import { useState } from "react";
import Checkout from "./Components/CheckOut";
import GenrePage from "./Components/GenrePage";
import useSession from "./Hooks/useSession";
import ProfilePage from "./Components/ProfilePage";
import MyOrdersPage from "./Components/MyOrdersPage";
import ProductListPage from "./Components/ProductListPage";

// Logic for conditional rendering- pain in the
const AppContent = ({ mode, toggleMode }) => {
  const location = useLocation();
  const [choice, setChoice] = useState("products");
  const [genchoice, setGenChoice] = useState("book");
  const { isAuthenticated, userInfo, setUserInfo, setIsAuthenticated } =
    useSession();

  // not required now since sign handled by backend login but may be needed for employeedash and admin dash
  const hideAppBar =
    location.pathname === "/signin" || location.pathname === "/signup";

  {
    /* Logic for not displaying the app bar when on SignIn or SignUp Page */
  }
  return (
    <Container maxWidth="xl">
      {!hideAppBar && (
        <ResponsiveAppBar
          key={isAuthenticated ? "admin" : "patron"}
          setChoice={setChoice}
          setGenChoice={setGenChoice}
          userInfo={userInfo}
          isAuthenticated={isAuthenticated}
          setUserInfo={setUserInfo}
          setIsAuthenticated={setIsAuthenticated}
          mode={mode}
          toggleMode={toggleMode}
        />
      )}
      <Routes>
        <Route
          path="/storemanagementdash"
          element={
            <CheckUser>
              {/* Check user works as protected route--made for keycloak serving same purpose */}
              <StoreMangementDash choice={choice} />
            </CheckUser>
          }
        />
        <Route path="/" element={<LandingPage />} />
        <Route path="/genre" element={<GenrePage genchoice={genchoice} />} />
        <Route path="/product/:id" element={<ProductDescription />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/myorders" element={<MyOrdersPage />} />
        <Route path="/productlist" element={<ProductListPage />} />
      </Routes>
    </Container>
  );
};

// Shows app content with the responsiveappbar // There can be only One BrowserRouter and Route is the child of Routes.
// Interchanging Routes and BrowserRouter breaks it.
const App = ({ mode, toggleMode }) => (
  <BrowserRouter>
    <AppContent mode={mode} toggleMode={toggleMode} />
  </BrowserRouter>
);

export default App;
