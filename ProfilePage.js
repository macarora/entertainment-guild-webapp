import { Box, Typography, Avatar, TextField, Button } from "@mui/material";
import { useSessionContext } from "../Context/sessionContext";
import useAxios from "../Hooks/useAxios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const { getPatron, getCustomerAddress, updatePatron } = useAxios(); // custom hook for API calls
  const { userInfo } = useSessionContext(); // session context for logged-in user
  const [patron, setPatron] = useState(null); // matched patron info
  const [address, setAddress] = useState(null); // address info
  const [isEditing, setIsEditing] = useState(false); // toggle edit mode
  const [editedAddress, setEditedAddress] = useState({}); // edited address fields
  const navigate = useNavigate(); // navigation

  const isAdmin = userInfo?.isAdmin || userInfo?.role === "admin"; // role check

  // fetch patron and address only for non-admin users
  useEffect(() => {
    async function fetchData() {
      if (!userInfo?.userId || isAdmin) {
        return;
      }
      const patronData = await getPatron();
      const matchedPatron = patronData?.list?.find(
        (p) => p?.UserID === userInfo.userId
      );
      if (!matchedPatron) {
        return;
      }
      const customerId = matchedPatron?.["TO List"]?.[0]?.CustomerID;
      setPatron(matchedPatron);

      if (customerId) {
        const caddr = await getCustomerAddress(customerId);

        setAddress(caddr);
        setEditedAddress(caddr);
      }
    }

    fetchData();
  }, [userInfo]);

  const handleChange = (field) => (e) => {
    setEditedAddress({ ...editedAddress, [field]: e.target.value });
  };

  const handleSave = async () => {
    const updated = {
      ...patron,
      StreetAddress: editedAddress.street,
      Suburb: editedAddress.suburb,
      State: editedAddress.state,
      PostCode: editedAddress.postcode,
    };

    await updatePatron(updated); // not working due to backend error ---untested
    setAddress(editedAddress);
    setIsEditing(false);
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 4,
        p: 3,
      }}
    >
      {/* Avatar with fallback logic */}
      <Avatar alt={userInfo?.name || "User"} src="/default-avatar.png">
        {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : "?"}
      </Avatar>

      {/* Greeting with fallback to email or username */}
      <Typography variant="h6" sx={{ mt: 2 }}>
        Hi {userInfo?.name || userInfo?.email || userInfo?.username}, welcome to
        your profile.
      </Typography>

      {/* Address block for patrons only */}
      {!isAdmin && address && !isEditing && (
        <>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Address: {address.street}, {address.suburb}, {address.state}{" "}
            {address.postcode}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button variant="contained" onClick={() => setIsEditing(true)}>
              Edit Address
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          </Box>
        </>
      )}
      {/* Address block for patrons only  for editting*/}
      {!isAdmin && isEditing && (
        <>
          <TextField
            label="Street"
            value={editedAddress.street || ""}
            onChange={handleChange("street")}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Suburb"
            value={editedAddress.suburb || ""}
            onChange={handleChange("suburb")}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="State"
            value={editedAddress.state || ""}
            onChange={handleChange("state")}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Postcode"
            value={editedAddress.postcode || ""}
            onChange={handleChange("postcode")}
            fullWidth
            sx={{ mt: 2 }}
          />
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </Box>
        </>
      )}
      {/* Address block for User only */}
      {isAdmin && (
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            color="error"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default ProfilePage;
