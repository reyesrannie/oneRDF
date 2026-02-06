import React, { useState } from "react";
import { Box, Button, Typography, Container, Stack } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, EffectCreative } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedSystem } from "../../../services/server/slice/renderSlice";
import DisplayOptions from "./DisplayOptions";

const IconDisplay = ({ data }) => {
  const dispatch = useDispatch();
  const [activeIndex, setActiveIndex] = useState(0);
  const systemImage = useSelector((state) => state.modal.systemImage);
  const selectedSystem = useSelector((state) => state.render.selectedSystem);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Grid container sx={{ width: "100%" }} alignItems="center">
        <Box
          sx={{
            position: { xs: "unset", md: "absolute" },
            bottom: { md: "220px" },
            left: { md: "160px" },
            zIndex: 10,
          }}
        >
          <DisplayOptions data={data} />
        </Box>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack
            marginLeft={{ xs: 0, md: 8, lg: 20 }}
            spacing={3}
            alignItems={{ xs: "center", md: "flex-start" }}
            sx={{
              animation: "fadeIn 0.5s ease-in-out",
              "@keyframes fadeIn": {
                "0%": { opacity: 0, transform: "translateY(10px)" },
                "100%": { opacity: 1, transform: "translateY(0)" },
              },
            }}
            key={selectedSystem.id}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: "bold",
                color: "#FFFFFF",
                textAlign: { xs: "center", md: "left" },
              }}
            >
              {selectedSystem.system_name}
            </Typography>

            <Typography
              sx={{
                color: "#FFFFFF",
                fontSize: "16px",
                lineHeight: 1.6,
                maxWidth: "500px",
                textAlign: { xs: "center", md: "left" },
              }}
            >
              {selectedSystem.description}
            </Typography>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#F7941D",
                filter: "brightness(1.2)",
                color: "white",
                fontWeight: "bold",
                padding: "12px 40px",
                "&:hover": {
                  backgroundColor: "white",
                  color: "#F7941D",
                },
              }}
              onClick={() => {
                const query = encodeURIComponent(
                  JSON.stringify(selectedSystem),
                );
                window.open(`/redirect?data=${query}`, "_blank");
              }}
            >
              Proceed
            </Button>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Swiper
            modules={[Pagination, EffectCreative]}
            spaceBetween={-50} // Remove space here, we handle it in alignment
            slidesPerView="auto" // <--- AUTO WIDTH (Crucial fix)
            centeredSlides={true} // Keep active item in middle
            slideToClickedSlide={true}
            speed={600}
            grabCursor={true}
            onSlideChange={(swiper) => {
              setActiveIndex(swiper.activeIndex);
              dispatch(setSelectedSystem(data[swiper.activeIndex]));
            }}
            pagination={{ clickable: true, dynamicBullets: true }}
            style={{ paddingBottom: "50px", width: "100%" }}
          >
            {data?.map((item, index) => {
              const image = systemImage?.find(
                (img) => img?.id === item?.id,
              )?.url;

              return (
                <SwiperSlide
                  key={item?.id}
                  style={{
                    width: "280px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                      width: "100%",
                      height: "400px",
                      opacity: activeIndex === index ? 1 : 0.5,
                      transition: "opacity 0.3s ease",
                      transform:
                        activeIndex === index ? "scale(1.3)" : "scale(0.7)",
                    }}
                  >
                    <Box
                      sx={{
                        width: "200px",
                        height: "200px",
                        borderRadius: "50%",
                        backgroundColor: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0px 20px 60px rgba(0,0,0,0.2)",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        "&:hover": { transform: "scale(1.05)" },
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={image}
                        style={{
                          width: "150px",
                        }}
                      />
                    </Box>
                  </Box>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default IconDisplay;
