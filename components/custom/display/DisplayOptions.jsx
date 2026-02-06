import React from "react";
import { ToggleButton, ToggleButtonGroup, styled } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedSystem,
  setSystemDisplay,
} from "../../../services/server/slice/renderSlice";

// 1. Update Styled Component to accept a custom prop 'isSlider'
// We use 'shouldForwardProp' to prevent 'isSlider' from being passed to the DOM element
const StyledToggleButtonGroup = styled(ToggleButtonGroup, {
  shouldForwardProp: (prop) => prop !== "isSlider",
})(({ theme, isSlider }) => ({
  "& .MuiToggleButtonGroup-grouped": {
    // 2. DYNAMIC STYLES: Check isSlider
    border: isSlider ? "1px solid rgba(255,255,255,0.7)" : "1px solid #888888",
    color: isSlider ? "#ffffff" : "#888888", // White for slider, Gray for list

    borderRadius: "50px",
    padding: "6px 24px",
    fontSize: "14px",
    textTransform: "capitalize",
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
      borderColor: "#1677FB",
      color: "#1677FB",
      backgroundColor: "transparent",
      zIndex: 2,
      "&:hover": {
        backgroundColor: "rgba(22, 119, 251, 0.04)",
      },

      // Fix left border for second item if selected
      "& + .MuiToggleButtonGroup-grouped": {
        borderLeft: isSlider
          ? "1px solid rgba(255,255,255,0.3)"
          : "1px solid #E0E0E0",
      },
    },

    // Hover State for unselected
    "&:hover": {
      backgroundColor: isSlider ? "rgba(255,255,255,0.1)" : "#F5F5F5",
      color: isSlider ? "#ffffff" : "#1e2a38", // Slightly darker on hover
    },
  },
}));

const DisplayOptions = ({ view, setView, data }) => {
  const dispatch = useDispatch();
  const systemDisplay = useSelector((state) => state.render.systemDisplay);

  // Helper boolean
  const isSlider = systemDisplay === "slider";

  return (
    <StyledToggleButtonGroup
      value={systemDisplay}
      exclusive
      aria-label="view switcher"
      isSlider={isSlider} // <--- Pass the prop here
    >
      <ToggleButton
        value="list"
        onClick={() => dispatch(setSystemDisplay("list"))}
      >
        List
      </ToggleButton>
      <ToggleButton
        value="slider"
        onClick={() => {
          dispatch(setSelectedSystem(data[0]));
          dispatch(setSystemDisplay("slider"));
        }}
      >
        Slider
      </ToggleButton>
    </StyledToggleButtonGroup>
  );
};

export default DisplayOptions;
