import { Stack, Typography } from "@mui/material";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { EffectCoverflow, Pagination } from "swiper/modules";
import "../../styles/Systems.scss";
import { useSelector } from "react-redux";

const IconDisplay = ({ data }) => {
  const systemImage = useSelector((state) => state.modal.systemImage);

  return (
    <>
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        loop={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        coverflowEffect={{
          rotate: 30,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: false,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[EffectCoverflow, Pagination]}
        className="mySwiper"
      >
        {data?.map((item, index) => {
          return (
            <SwiperSlide key={index}>
              <Stack
                sx={{ backgroundColor: "transparent" }}
                display={"flex"}
                alignItems={"center"}
                onClick={(e) => window.open(item?.url_holder, "_blank")}
              >
                <img src={systemImage[item?.id]} />
                <Typography>{item?.system_name}</Typography>
              </Stack>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
};

export default IconDisplay;
