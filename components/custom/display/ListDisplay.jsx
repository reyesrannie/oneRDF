import React, { useMemo, useState } from "react";
import { Box, MenuItem, TextField } from "@mui/material";
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
import { setSystemDisplay } from "../../../services/server/slice/renderSlice";

const chunkArray = (array, chunkSize) => {
  const results = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    while (chunk.length < chunkSize) {
      chunk.push(null);
    }
    results.push(chunk);
  }
  return results;
};

const ListDisplay = ({ data }) => {
  const dispatch = useDispatch();
  const isDrawerOpen = useSelector((state) => state.drawer.isDrawerOpen);
  const systemDisplay = useSelector((state) => state.render.systemDisplay);

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
    return chunkArray(filteredData, 4);
  }, [filteredData]);

  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <Box
      sx={{
        width: isDrawerOpen ? "85%" : "95%",
        height: "90vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        "& .swiper": {
          width: "100%",
          paddingBottom: "60px",
          paddingLeft: "50px",
          paddingRight: "50px",
        },
        "& .swiper-button-next, & .swiper-button-prev": {
          color: "#F7941D",
          fontWeight: "bold",
          width: "40px",
          height: "40px",
          zIndex: 50,
        },
        "& .swiper-button-next": { right: "10px" },
        "& .swiper-button-prev": { left: "10px" },

        // 1. CSS FIX: Keep disabled arrows visible but dimmed
        "& .swiper-button-disabled": {
          opacity: 0.35,
          pointerEvents: "none", // Prevent clicking
        },

        // 2. CSS FIX: Ensure pagination (dots) shows even for 1 page
        "& .swiper-pagination": {
          display: "block !important",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "100px",
          right: "300px",
          zIndex: 10,
          width: "200px",
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
          {uniqueCategories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: "100px",
          right: "60px",
          zIndex: 10,
        }}
      >
        <DisplayOptions />
      </Box>

      <Swiper
        key={selectedCategory}
        slidesPerView={1}
        modules={[Pagination, Navigation]}
        navigation={true}
        pagination={{ clickable: true }}
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
                paddingTop: "40px",
              }}
            >
              <Grid
                container
                spacing={4}
                sx={{
                  maxWidth: "1000px",
                  width: "100%",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}
              >
                {chunk.map((item, itemIndex) => (
                  <Grid
                    key={itemIndex}
                    size={{ xs: 12, md: 6 }}
                    display="flex"
                    justifyContent="center"
                  >
                    {item ? (
                      <SystemCard data={item} />
                    ) : (
                      <Box sx={{ width: "100%", minHeight: "200px" }} />
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
