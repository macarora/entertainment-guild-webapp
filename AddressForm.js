import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/material/styles";
import useFormValidation from "../Hooks/useFormValidation";
import { useEffect } from "react";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

export default function AddressForm({ onValidate, setAddressDetails }) {
  const { formData, setForm, isValid } = useFormValidation(
    {
      firstName: "",
      address1: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
    ["firstName", "address1", "city", "state", "zip", "country"] // required fields being passed to the hook
  );

  useEffect(() => {
    onValidate?.(isValid);
    if (isValid) {
      setAddressDetails(formData); // adding the address details to saved and passed for the review page
    }
  }, [formData, isValid]);

  return (
    <Grid container spacing={3}>
      <FormGrid size={{ xs: 12, md: 6 }}>
        {/* First Name */}
        <FormLabel htmlFor="first-name" required>
          First name
        </FormLabel>
        <OutlinedInput
          id="firstname"
          name="firstname"
          type="name"
          placeholder="John"
          autoComplete="first name"
          required
          size="small"
          value={formData.firstName}
          onChange={(e) => setForm("firstName", e.target.value)}
        />
      </FormGrid>
      <FormGrid size={{ xs: 12, md: 6 }}>
        {/* Last Name */}
        <FormLabel htmlFor="last-name">Last name</FormLabel>
        <OutlinedInput
          id="lastname"
          name="lastname"
          type="lastname"
          placeholder="Snow"
          autoComplete="last name"
          size="small"
        />
      </FormGrid>
      <FormGrid size={{ xs: 12 }}>
        {/* Address */}
        <FormLabel htmlFor="address1" required>
          Address line 1
        </FormLabel>
        <OutlinedInput
          id="address1"
          name="address1"
          type="address1"
          placeholder="Street name and number"
          autoComplete="shipping address-line1"
          required
          size="small"
          value={formData.address1}
          onChange={(e) => setForm("address1", e.target.value)}
        />
      </FormGrid>
      <FormGrid size={{ xs: 12 }}>
        {/* Address */}
        <FormLabel htmlFor="address2">Address line 2</FormLabel>
        <OutlinedInput
          id="address2"
          name="address2"
          type="address2"
          placeholder="Apartment, suite, unit, etc. (optional)"
          autoComplete="shipping address-line2"
          required
          size="small"
        />
      </FormGrid>
      <FormGrid size={{ xs: 6 }}>
        {/* City */}
        <FormLabel htmlFor="city" required>
          City
        </FormLabel>
        <OutlinedInput
          id="city"
          name="city"
          type="city"
          placeholder="Sydney"
          autoComplete="City"
          required
          size="small"
          value={formData.city}
          onChange={(e) => setForm("city", e.target.value)}
        />
      </FormGrid>
      <FormGrid size={{ xs: 6 }}>
        {/* State */}
        <FormLabel htmlFor="state" required>
          State
        </FormLabel>
        <OutlinedInput
          id="state"
          name="state"
          type="state"
          placeholder="NSW"
          autoComplete="State"
          required
          size="small"
          value={formData.state}
          onChange={(e) => setForm("state", e.target.value)}
        />
      </FormGrid>
      <FormGrid size={{ xs: 6 }}>
        {/* Post Code */}
        <FormLabel htmlFor="zip" required>
          Zip / Postal code
        </FormLabel>
        <OutlinedInput
          id="zip"
          name="zip"
          type="zip"
          placeholder="12345"
          autoComplete="shipping postal-code"
          required
          size="small"
          value={formData.zip}
          onChange={(e) => setForm("zip", e.target.value)}
        />
      </FormGrid>
      <FormGrid size={{ xs: 6 }}>
        {/* Country */}
        <FormLabel htmlFor="country" required>
          Country
        </FormLabel>
        <OutlinedInput
          id="country"
          name="country"
          type="country"
          placeholder="Australia"
          autoComplete="shipping country"
          required
          size="small"
          value={formData.country}
          onChange={(e) => setForm("country", e.target.value)}
        />
      </FormGrid>
      <FormGrid size={{ xs: 12 }}>
        {/* CheckBox to save address -- when patron starts working need a post request here */}
        <FormControlLabel
          control={<Checkbox name="saveAddress" value="yes" />}
          label="Use this address for payment details"
        />
      </FormGrid>
    </Grid>
  );
}
