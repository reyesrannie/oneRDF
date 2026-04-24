import React from "react";
import { Dialog, Typography, Box } from "@mui/material";
import { keyframes } from "@mui/system";
import logoDrawer from "../../assets/png/logoDrawer.png";

// Define the keyframe animation
const pulse = keyframes`
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.8; }
`;

const RouteLoader = () => {
  return (
    <Dialog
      open={true}
      sx={{
        "& .MuiBackdrop-root": {
          backgroundColor: "transparent",
        },
      }}
      PaperProps={{
        sx: {
          backgroundColor: "transparent",
          boxShadow: "none",
          overflow: "hidden",
          // Added flex properties to perfectly center the logo and text
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      <Box
        component="img"
        src={logoDrawer}
        alt="Logo"
        sx={{
          width: "200px", // Adjust this based on your actual logo size
          animation: `${pulse} 1.5s ease-in-out infinite`,
          mb: 2, // Adds a little spacing between the logo and the text
        }}
      />
      <Typography
        sx={{
          color: "#17619A", // Matching your app's primary blue theme
          fontWeight: "bold",
          letterSpacing: "1px",
          animation: `${pulse} 1.5s ease-in-out infinite`, // Optional: makes the text pulse with the logo
        }}
      >
        Loading....
      </Typography>
    </Dialog>
  );
};

export default RouteLoader;
