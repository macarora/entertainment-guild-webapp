import React from "react";

import { Box, Typography } from "@mui/material";
import TopPromoLineData from "../Data/TopPromoLineData";

const TopPromoLineComponent = () => (
  <Typography
    variant="h4"
    align="center"
    sx={{
      color: "grey",
      mb: 5,
    }}
  >
    {" "}
    {TopPromoLineData[0].title}
  </Typography>
);

export default TopPromoLineComponent;
