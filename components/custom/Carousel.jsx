import React, { useState, useRef } from "react";
import { Box, Button, MobileStepper } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { images } from "../../services/constant/dataSample";
import AppCard from "./AppCard";
import "../styles/Carousel.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const Carousel = () => {
  const [activeStep, setActiveStep] = useState(0);
  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (index) => {
      setActiveStep(index);
      if (sliderRef.current) {
        sliderRef.current.slickPause();
        setTimeout(() => {
          sliderRef.current.slickPlay();
        }, 2000);
      }
    },
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
  };

  return (
    <Box className="carousel-container">
      <Box className="carousel-slider-container">
        <Slider ref={sliderRef} {...settings}>
          {images?.map((image, index) => (
            <AppCard
              key={index}
              title={image.title}
              sub={image.sub}
              content={image.content}
              footer={image.footer}
              img={image.img}
              backgroundImage={image.background}
            />
          ))}
        </Slider>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <MobileStepper
          variant="dots"
          steps={images.length}
          position="static"
          activeStep={activeStep}
          sx={{ maxWidth: 400, flexGrow: 1 }}
        />
      </Box>
    </Box>
  );
};

export default Carousel;
