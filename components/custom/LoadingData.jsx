import { Box, Dialog, Stack } from "@mui/material";
import "../styles/LoadingRender.scss";
import Logo from "../../assets/png/OneMis.png";

import React from "react";

const LoadingData = ({ open }) => {
  return (
    <Dialog
      open={open}
      sx={{
        "& .MuiPaper-root": {
          backgroundColor: "transparent",
          boxShadow: "none",
        },
        backdropFilter: "blur(0px)", // Optional: Remove blur effect
      }}
    >
      <Box className={`loading-container-data`}>
        <Stack flexDirection={"column"} gap={2} alignItems="center">
          <img src={Logo} alt="Logo" className="loading-logo-data" />
          Loading Please wait...
        </Stack>
      </Box>
    </Dialog>
  );
};

export default LoadingData;
