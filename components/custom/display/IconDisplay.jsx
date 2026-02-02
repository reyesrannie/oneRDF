// components/IconDisplay.js
import React, { useState } from "react";
import { Box, Button, Typography, Container, Stack } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade"; // Use fade or standard slide

// import GlassToggle from "./GlassToggle"; // Import the toggle we made above
import { useDispatch, useSelector } from "react-redux";
// import { setSystemDisplay } from ... (your slice path)

// MOCK DATA: Each item has a specific 'themeColor'
const SYSTEM_DATA = [
  {
    id: 1,
    name: "Vladimir",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text.",
    logo: "V", // Replace with image URL
    themeColor: "#F7941D", // Orange
    secondaryColor: "#1e2a38", // Dark Blue Blob
  },
  {
    id: 2,
    name: "Arcana",
    description:
      "Arcana allows for complex server management and node distribution across multiple channels.",
    logo: "A", // Replace with image URL
    themeColor: "#1677FB", // Blue
    secondaryColor: "#101820", // Darker Blob
  },
  {
    id: 3,
    name: "Zeus",
    description:
      "Cloud computing power at your fingertips with real-time monitoring and analytics.",
    logo: "Z", // Replace with image URL
    themeColor: "#8E44AD", // Purple
    secondaryColor: "#2C3E50", // Dark Gray Blob
  },
];

const IconDisplay = () => {
  const dispatch = useDispatch();

  const [activeIndex, setActiveIndex] = useState(0);

  const activeTheme = SYSTEM_DATA[activeIndex];

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minHeight: "80vh", // Adjust height as needed
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        transition: "background-color 0.8s ease", // SMOOTH COLOR TRANSITION
        backgroundColor: activeTheme.themeColor,
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <Swiper
          modules={[Pagination, EffectFade]}
          spaceBetween={50}
          slidesPerView={1}
          speed={800} // Slower speed for smoother transition
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          pagination={{ clickable: true, dynamicBullets: true }}
          style={{ paddingBottom: "50px" }}
        >
          {SYSTEM_DATA.map((item) => (
            <SwiperSlide key={item.id}>
              <Grid container spacing={4} alignItems="center">
                {/* LEFT SIDE: TEXT */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack
                    spacing={3}
                    alignItems={{ xs: "center", md: "flex-start" }}
                  >
                    <Typography
                      variant="h2"
                      sx={{
                        fontWeight: "bold",
                        color: "white",
                        textAlign: { xs: "center", md: "left" },
                      }}
                    >
                      {item.name}
                    </Typography>

                    <Typography
                      sx={{
                        color: "rgba(255,255,255,0.9)",
                        fontSize: "16px",
                        lineHeight: 1.6,
                        maxWidth: "500px",
                        textAlign: { xs: "center", md: "left" },
                      }}
                    >
                      {item.description}
                    </Typography>

                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "rgba(255,255,255,0.2)",
                        backdropFilter: "blur(5px)",
                        color: "white",
                        fontWeight: "bold",
                        padding: "10px 30px",
                        boxShadow: "none",
                        border: "1px solid rgba(255,255,255,0.4)",
                        "&:hover": {
                          backgroundColor: "white",
                          color: activeTheme.themeColor,
                        },
                      }}
                    >
                      Proceed
                    </Button>
                  </Stack>
                </Grid>

                {/* RIGHT SIDE: LOGO CIRCLE */}
                <Grid
                  size={{ xs: 12, md: 6 }}
                  display="flex"
                  justifyContent="center"
                >
                  <Box
                    sx={{
                      width: "300px",
                      height: "300px",
                      borderRadius: "50%",
                      backgroundColor: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0px 20px 50px rgba(0,0,0,0.3)",
                    }}
                  >
                    {/* Placeholder for Logo Image */}
                    <Typography
                      variant="h1"
                      sx={{ color: activeTheme.themeColor, fontWeight: "bold" }}
                    >
                      {item.logo}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </Box>
  );
};

export default IconDisplay;
