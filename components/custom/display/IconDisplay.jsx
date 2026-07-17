import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Stack } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Pagination,
  EffectCreative,
  Navigation,
  Keyboard,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedSystem } from "../../../services/server/slice/renderSlice";
import DisplayOptions from "./DisplayOptions";

const IconDisplay = ({ data }) => {
  const dispatch = useDispatch();
  const [activeIndex, setActiveIndex] = useState(0);
  const selectedSystem = useSelector((state) => state.render.selectedSystem);
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const handleGlobalEnter = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();

        if (selectedSystem) {
          const query = encodeURIComponent(JSON.stringify(selectedSystem));
          window.open(`/redirect?data=${query}`, "_blank");
        }
      }
    };

    window.addEventListener("keydown", handleGlobalEnter);

    return () => {
      window.removeEventListener("keydown", handleGlobalEnter);
    };
  }, [selectedSystem]);

  return (
    <Box
      sx={{
        position: "relative",
        width: { xs: "98vw", xl: "100%" },
        height: { xs: "unset", xl: "100vh" },
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Grid container sx={{ width: "100%" }} alignItems="center">
        <Box
          sx={{
            position: { xs: "unset", md: "absolute" },
            bottom: { md: "1px", xl: "150px" },
            left: { lg: "160px" },
            zIndex: 10,
            marginTop: { xs: 2, md: 0 },
            marginBottom: { xs: 2, md: 0 },
          }}
        >
          <DisplayOptions data={data} />
        </Box>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack
            marginLeft={{ xs: "unset", md: 8, lg: 20 }}
            spacing={{ xs: 0, md: 2, lg: 3 }}
            alignItems={{ xs: "center", md: "flex-start" }}
            sx={{
              animation: "fadeIn 0.5s ease-in-out",
              "@keyframes fadeIn": {
                "0%": { opacity: 0, transform: "translateY(10px)" },
                "100%": { opacity: 1, transform: "translateY(0)" },
              },
            }}
            key={selectedSystem?.id || "system-text"}
          >
            <Typography
              variant={"h1"}
              sx={{
                fontWeight: "bold",
                color: "#FFFFFF",
                textAlign: { xs: "center", md: "left" },
                fontSize: { xs: "1.3rem", md: "2rem", lg: "3rem" },
              }}
            >
              {selectedSystem?.system_name}
            </Typography>

            <Typography
              sx={{
                color: "#FFFFFF",
                fontSize: { xs: "10px", md: "16px" },
                lineHeight: 1.6,
                maxWidth: { xs: "unset", md: "400px", lg: "500px" },
                textAlign: { xs: "center", md: "left" },
                display: "-webkit-box",
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3,
              }}
            >
              {selectedSystem?.description}
            </Typography>

            {selectedSystem && (
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#F7941D",
                  filter: "brightness(1.2)",
                  color: "white",
                  fontWeight: "bold",
                  padding: { sx: "12px 40px", lg: "12px 40px" },
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
            )}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              width: "100%",
              "& .swiper-button-next, & .swiper-button-prev": {
                color: "#F7941D",
                backgroundColor: "transparent",
                opacity: 0,
                transition: "opacity 0.3s ease-in-out",
              },
              "&:hover .swiper-button-next, &:hover .swiper-button-prev": {
                opacity: 1,
              },
              "& .swiper-pagination-bullet": {
                backgroundColor: "#FFFFFF", // Light color for inactive dots
                opacity: 0.5,
              },
              "& .swiper-pagination-bullet-active": {
                backgroundColor: "#FFFFFF", // Light color for active dot
                opacity: 1,
              },
            }}
          >
            <Swiper
              modules={[Pagination, EffectCreative, Navigation, Keyboard]}
              keyboard={{
                enabled: true,
              }}
              navigation={true}
              loop={true}
              spaceBetween={-50}
              slidesPerView="auto"
              centeredSlides={true}
              slideToClickedSlide={false}
              speed={600}
              grabCursor={true}
              onSlideChange={(swiper) => {
                setActiveIndex(swiper.realIndex);
                dispatch(setSelectedSystem(data[swiper.realIndex]));
              }}
              pagination={{ clickable: true, dynamicBullets: true }}
              style={{ paddingBottom: "50px", width: "100%" }}
            >
              {data?.map((item, index) => {
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
                      marginTop={{ xs: 5, md: 0 }}
                      sx={{
                        width: "100%",
                        height: { sx: "200px", md: "300px", lg: "400px" },
                        opacity: activeIndex === index ? 1 : 0.5,
                        transition: "opacity 0.3s ease",
                        transform:
                          activeIndex === index ? "scale(1.3)" : "scale(0.7)",
                      }}
                      onClick={(e) => {
                        if (activeIndex === index) {
                          const query = encodeURIComponent(
                            JSON.stringify(selectedSystem),
                          );
                          window.open(`/redirect?data=${query}`, "_blank");
                        } else {
                          e?.preventDefault();
                        }
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: "150px", md: "200px", lg: "200px" },
                          height: { xs: "150px", md: "200px", lg: "200px" },
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
                          src={`${baseURL}/${item?.system_image?.replace("public/", "storage/")?.replace("//", "/")}`}
                          alt={item?.system_name}
                          style={{
                            width: "75%", // Shrinks the image so the white Box background shows around it
                            height: "75%", // Keeps it proportional
                            objectFit: "contain", // Ensures the whole image fits inside its new 75% boundary without being cropped
                          }}
                        />
                      </Box>
                    </Box>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default IconDisplay;
