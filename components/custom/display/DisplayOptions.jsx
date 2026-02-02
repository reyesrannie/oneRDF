import React from "react";
import { ToggleButton, ToggleButtonGroup, styled } from "@mui/material";
import ListIcon from "@mui/icons-material/List"; // Optional icons
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel"; // Optional icons
import { useDispatch, useSelector } from "react-redux";
import { setSystemDisplay } from "../../../services/server/slice/renderSlice";

// Styled Component to match the image exactly
const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  "& .MuiToggleButtonGroup-grouped": {
    border: "1px solid #888888",
    borderRadius: "50px", // Pill shape
    padding: "6px 24px", // Adjust width of buttons
    fontSize: "14px",
    textTransform: "capitalize", // Capitalize like image (List, Slider)
    color: "#000",
    backgroundColor: "transparent",

    // Prevent double borders in the middle
    "&:not(:first-of-type)": {
      marginLeft: "-1px",
      borderLeft: "1px solid transparent",
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    },
    "&:not(:last-of-type)": {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },

    // Selected State (Blue Border & Text)
    "&.Mui-selected": {
      borderColor: "#1677FB", // Or your theme primary color
      color: "#1677FB",
      backgroundColor: "transparent", // Keep transparent background
      zIndex: 2, // Bring to front to show full border
      "&:hover": {
        backgroundColor: "rgba(22, 119, 251, 0.04)",
      },

      // Fix left border for second item if selected
      "& + .MuiToggleButtonGroup-grouped": {
        borderLeft: "1px solid #E0E0E0",
      },
    },

    // Hover State for unselected
    "&:hover": {
      backgroundColor: "#F5F5F5",
    },
  },
}));

const DisplayOptions = ({ view, setView }) => {
  const dispatch = useDispatch();
  const systemDisplay = useSelector((state) => state.render.systemDisplay);

  return (
    <StyledToggleButtonGroup
      value={systemDisplay}
      exclusive
      aria-label="view switcher"
    >
      <ToggleButton
        value="list"
        onClick={() => dispatch(setSystemDisplay("list"))}
      >
        List
      </ToggleButton>
      <ToggleButton
        value="slider"
        onClick={() => dispatch(setSystemDisplay("slider"))}
      >
        Slider
      </ToggleButton>
    </StyledToggleButtonGroup>
  );
};

export default DisplayOptions;
