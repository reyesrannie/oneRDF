import React, { useMemo, useState } from "react";
import {
  Box,
  MenuItem,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";

import SystemCard from "../SystemCard";
import "../../styles/ListDisplay.scss";
import { useDispatch, useSelector } from "react-redux";
import DisplayOptions from "./DisplayOptions";

const chunkArray = (array, chunkSize) => {
  const results = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    if (chunkSize > 1) {
      while (chunk.length < chunkSize) {
        chunk.push(null);
      }
    }
    results.push(chunk);
  }
  return results;
};

const ListDisplay = ({ data }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDrawerOpen = useSelector((state) => state.drawer.isDrawerOpen);

  // Breakpoints
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md")); // < 900px
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("md", "lg")); // 900px - 1200px

  const [selectedCategory, setSelectedCategory] = useState("All");

  const uniqueCategories = useMemo(() => {
    if (!data) return [];
    const categories = data.map((item) => item?.category?.name).filter(Boolean);
    return [...new Set(categories)].sort();
  }, [data]);

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (selectedCategory === "All") return data;
    return data.filter((item) => item.category?.name === selectedCategory);
  }, [data, selectedCategory]);

  const dataChunks = useMemo(() => {
    let chunkSize = 4; // Default (Large screens)

    if (isSmallScreen) {
      chunkSize = 1;
    } else if (isMediumScreen) {
      chunkSize = 2;
    }

    return chunkArray(filteredData, chunkSize);
  }, [filteredData, isSmallScreen, isMediumScreen]);

  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <Box
      sx={{
        width: isDrawerOpen ? "85%" : { sx: "100%", md: "65%", lg: "80%" },
        // Allow height to grow automatically on medium screens since column stacks are tall
        height: { xs: "auto", md: isMediumScreen ? "auto" : "90vh" },
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        "& .swiper": {
          width: "100%",
          paddingBottom: "60px",
          paddingLeft: { xs: "0px", md: "50px" },
          paddingRight: { xs: "0px", md: "50px" },
        },
        "& .swiper-button-next, & .swiper-button-prev": {
          color: "#F7941D",
          fontWeight: "bold",
          width: "40px",
          height: "40px",
          zIndex: 50,
          display: { xs: "none", md: "flex" },
        },
        "& .swiper-button-next": { right: "10px" },
        "& .swiper-button-prev": { left: "10px" },
        "& .swiper-button-disabled": {
          opacity: 0.35,
          pointerEvents: "none",
        },
        "& .swiper-pagination": {
          display: "block !important",
          bottom: "0px !important",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: { xs: "200px", md: "100%" },
          justifyContent: { xs: "center", md: "flex-end" },
          alignItems: { xs: "center", md: "center" },
          gap: 2,
          position: { xs: "relative", md: "absolute" },
          top: { md: "1px" },
          right: { md: "40px" },
          zIndex: 10,
          flexDirection: { xs: "column", md: "row" },
          marginTop: { xs: "20px", md: "0" },
          marginBottom: { xs: "20px", md: "0" },
          paddingX: { xs: 2, md: 0 },
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "200px" },
            backgroundColor: "white",
            borderRadius: "4px",
          }}
        >
          <TextField
            select
            fullWidth
            size="small"
            value={selectedCategory}
            onChange={handleChange}
            label="Filter System"
            variant="outlined"
          >
            <MenuItem value="All">All Systems</MenuItem>
            {uniqueCategories?.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "flex-end", md: "center" },
          }}
        >
          <DisplayOptions data={data} />
        </Box>
      </Box>

      <Swiper
        key={`${selectedCategory}-${isSmallScreen ? "small" : isMediumScreen ? "medium" : "large"}`}
        slidesPerView={1}
        modules={[Pagination, Navigation]}
        navigation={true}
        pagination={{ clickable: true }}
        spaceBetween={isSmallScreen ? 30 : 500}
      >
        {dataChunks.map((chunk, pageIndex) => (
          <SwiperSlide key={pageIndex}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                height: "100%",
                width: "100%",
                // Increase top padding on Medium to clear filters, as the column starts higher
                paddingTop: { xs: "10px", md: "60px" },
              }}
            >
              <Grid
                container
                spacing={4}
                sx={{
                  maxWidth: "1000px",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "flex-start",
                }}
              >
                {chunk.map((item, itemIndex) => (
                  <Grid
                    key={itemIndex}
                    // --- GRID SIZE LOGIC ---
                    size={{
                      xs: 12, // Mobile: Full width (Column)
                      md: 12, // Medium (2 items): Full width (Column/Stacked)
                      lg: 6, // Desktop (4 items): Half width (2x2 Grid)
                    }}
                    display="flex"
                    justifyContent="center"
                  >
                    {item ? (
                      <SystemCard data={item} />
                    ) : (
                      !isSmallScreen && (
                        <Box sx={{ width: "100%", minHeight: "200px" }} />
                      )
                    )}
                  </Grid>
                ))}
              </Grid>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default ListDisplay;
