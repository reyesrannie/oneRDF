import React from "react";
import logoDrawer from "../../assets/png/logoDrawer.png";
import { Box } from "@mui/material";
import "../styles/LoadingRender.scss";
import { useSelector } from "react-redux";

const LoadingRender = () => {
  const fadeOut = useSelector((state) => state.render.fadeOut);

  return (
    <Box className={`loading-container ${fadeOut ? "fade-out" : ""}`}>
      <img src={logoDrawer} alt="Logo" className="loading-logo" />
    </Box>
  );
};

export default LoadingRender;
