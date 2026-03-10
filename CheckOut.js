import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import AddressForm from "../CheckOutComponents/AddressForm";
import Info from "../CheckOutComponents/Info";
import InfoMobile from "../CheckOutComponents/InfoMobile";
import PaymentForm from "../CheckOutComponents/PaymentForm";
import Review from "../CheckOutComponents/Review";
import { useMyCartContext } from "../Context/Context";
import { useState } from "react";
import useAxios from "../Hooks/useAxios";

//from mui--
const steps = ["Shipping address", "Payment details", "Review your order"];

// most components from mui-- setting up others function to actual use
export default function Checkout() {
  const [activeStep, setActiveStep] = useState(0);
  const [paymentDetails, setPaymentDetails] = useState({});
  const [addressDetails, setAddressDetails] = useState({});
  const [finalTotalPrice, setFinalTotalPrice] = useState("");
  const [isStepValid, setIsStepValid] = useState(false);
  const { createOrder } = useAxios();

  const { cart, clearCart } = useMyCartContext();

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <AddressForm
            setAddressDetails={setAddressDetails}
            onValidate={setIsStepValid}
          />
        );
      case 1:
        return (
          <PaymentForm
            setPaymentDetails={setPaymentDetails}
            onValidate={setIsStepValid}
          />
        );
      case 2:
        return (
          <Review
            addressDetails={addressDetails}
            paymentDetails={paymentDetails}
          />
        );
      default:
        throw new Error("Unknown step");
    }
  }
  // added so that the user cannot skip the page without filling the information-- contemplation using Snackbar instead of standard alert.
  const handleNext = async () => {
    if (activeStep === 0 && !isStepValid) {
      alert("Please fill out all required fields.");
      return;
    }

    if (activeStep === steps.length - 1) {
      const newOrder = {
        address: addressDetails,
        payment: paymentDetails,
        cart: cart,
      };

      try {
        const result = await createOrder(newOrder);

        if (result?.success || result?.OrderID) {
          console.log("Order placed successfully:", result);

          clearCart(); //clearCart after order placed

          setActiveStep(activeStep + 1); // next screen
        } else {
          alert("Order failed. Please try again.");
        }
      } catch (error) {
        alert("Something went wrong while placing the order.");
      }

      return;
    }
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <Grid
      container
      sx={{
        height: {
          xs: "100%",
          sm: "calc(100dvh - var(--template-frame-height, 0px))",
        },
        mt: {
          xs: 4,
          sm: 0,
        },
      }}
    >
      <Grid
        size={{ xs: 12, sm: 5, lg: 4 }}
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          backgroundColor: "background.paper",
          borderRight: { sm: "none", md: "1px solid" },
          borderColor: { sm: "none", md: "divider" },
          alignItems: "start",
          pt: 16,
          px: 10,
          gap: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            width: "100%",
            maxWidth: 500,
          }}
        >
          <Info />
        </Box>
      </Grid>

      <Grid
        size={{ sm: 12, md: 7, lg: 8 }}
        sx={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "100%",
          width: "100%",
          backgroundColor: { xs: "transparent", sm: "background.default" },
          alignItems: "start",
          pt: { xs: 0, sm: 16 },
          px: { xs: 2, sm: 10 },
          gap: { xs: 4, md: 8 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: { sm: "space-between", md: "flex-end" },
            alignItems: "center",
            width: "100%",
            maxWidth: { sm: "100%", md: 600 },
          }}
        >
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexGrow: 1,
            }}
          >
            <Stepper
              id="desktop-stepper"
              activeStep={activeStep}
              sx={{ width: "100%", height: 40 }}
            >
              {steps.map((label) => (
                <Step
                  sx={{ ":first-child": { pl: 0 }, ":last-child": { pr: 0 } }}
                  key={label}
                >
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </Box>
        <Card sx={{ display: { xs: "flex", md: "none" }, width: "100%" }}>
          <CardContent
            sx={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <Typography variant="subtitle2" gutterBottom>
                Selected products
              </Typography>
              <Typography variant="body1">
                {activeStep >= 2 ? "$144.97" : "$134.98"}
              </Typography>
            </div>
            <InfoMobile totalPrice={activeStep >= 2 ? "$144.97" : "$134.98"} />
          </CardContent>
        </Card>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            width: "100%",
            maxWidth: { sm: "100%", md: 600 },
            maxHeight: "720px",
            gap: { xs: 5, md: "none" },
          }}
        >
          <Stepper
            id="mobile-stepper"
            activeStep={activeStep}
            alternativeLabel
            sx={{ display: { sm: "flex", md: "none" } }}
          >
            {steps.map((label) => (
              <Step
                sx={{
                  ":first-child": { pl: 0 },
                  ":last-child": { pr: 0 },
                  "& .MuiStepConnector-root": { top: { xs: 6, sm: 12 } },
                }}
                key={label}
              >
                <StepLabel
                  sx={{ ".MuiStepLabel-labelContainer": { maxWidth: "70px" } }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <Stack spacing={2} useFlexGap>
              <Typography variant="h1">📦</Typography>
              <Typography variant="h5">Thank you for your order!</Typography>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                Your order number is
                <strong>&nbsp;#140396</strong>. We have emailed your order
                confirmation and will update you once its shipped.
              </Typography>
              <Button
                variant="contained"
                sx={{ alignSelf: "start", width: { xs: "100%", sm: "auto" } }}
              >
                Go to my orders
              </Button>
            </Stack>
          ) : (
            <React.Fragment>
              {getStepContent(activeStep)}
              <Box
                sx={[
                  {
                    display: "flex",
                    flexDirection: { xs: "column-reverse", sm: "row" },
                    alignItems: "end",
                    flexGrow: 1,
                    gap: 1,
                    pb: { xs: 12, sm: 0 },
                    mt: { xs: 2, sm: 0 },
                    mb: "60px",
                  },
                  activeStep !== 0
                    ? { justifyContent: "space-between" }
                    : { justifyContent: "flex-end" },
                ]}
              >
                {activeStep !== 0 && (
                  <Button
                    startIcon={<ChevronLeftRoundedIcon />}
                    onClick={handleBack}
                    variant="text"
                    sx={{ display: { xs: "none", sm: "flex" } }}
                  >
                    Previous
                  </Button>
                )}
                {activeStep !== 0 && (
                  <Button
                    startIcon={<ChevronLeftRoundedIcon />}
                    onClick={handleBack}
                    variant="outlined"
                    fullWidth
                    sx={{ display: { xs: "flex", sm: "none" } }}
                  >
                    Previous
                  </Button>
                )}
                <Button
                  variant="contained"
                  endIcon={<ChevronRightRoundedIcon />}
                  onClick={handleNext}
                  sx={{ width: { xs: "100%", sm: "fit-content" } }}
                >
                  {activeStep === steps.length - 1 ? "Place order" : "Next"}
                </Button>
              </Box>
            </React.Fragment>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}
