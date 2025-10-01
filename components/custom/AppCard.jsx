import React from "react";
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import "../styles/AppCard.scss";
import { use } from "react";
import { useSelector } from "react-redux";

const AppCard = ({
  title,
  sub,
  content,
  footer,
  img,
  backgroundImage,
  style,
}) => {
  const theme = useTheme();
  const mode = useSelector((state) => state.theme.mode);
  const isTabletPortrait = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Card
      className="app-card-container"
      style={{
        ...style,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(10px)",
          opacity: 0.7,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
        }}
      />

      <CardContent style={{ position: "relative", zIndex: 1 }}>
        <Stack
          justifyContent={"space-between"}
          flexDirection={"row"}
          minHeight={"300px"}
          maxHeight={"300px"}
          style={{
            background: `${
              mode === "light"
                ? "rgba(255, 255, 255, 0.5)"
                : "rgba(0, 0, 0, 0.5)"
            }`, // Dark semi-transparent background
            padding: "10px",
            borderRadius: "10px",
            // display: "inline-block",
          }}
        >
          <Stack
            className="scrollable-stack"
            overflow={"auto"}
            maxWidth={isTabletPortrait ? "100%" : "50%"}
          >
            <Typography className="app-card-content-title">{title}</Typography>
            <Typography className="app-card-content-subtitle">{sub}</Typography>
            <Typography className="app-card-content-body">{content}</Typography>
            <Typography className="app-card-content-footer">
              {footer}
            </Typography>
          </Stack>
          {!isTabletPortrait && (
            <Stack className="scrollable-stack">
              <img src={img} alt="picture1" className="app-card-image" />
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default AppCard;
