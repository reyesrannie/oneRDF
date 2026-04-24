import React from "react";
import { ToggleButton, ToggleButtonGroup, styled } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedSystem,
  setSystemDisplay,
} from "../../../services/server/slice/renderSlice";

const StyledToggleButtonGroup = styled(ToggleButtonGroup, {
  shouldForwardProp: (prop) => prop !== "isSlider",
})(({ theme, isSlider }) => ({
  "& .MuiToggleButtonGroup-grouped": {
    border: isSlider ? "1px solid rgba(255,255,255,0.7)" : "1px solid #888888",
    color: isSlider ? "#ffffff" : "#888888", // White for slider, Gray for list
    borderRadius: "50px",
    padding: "6px 24px",
    fontSize: "10px",

    [theme.breakpoints.up("md")]: {
      padding: "6px 24px",
      fontSize: "12px",
    },

    textTransform: "capitalize",
    backgroundColor: "transparent",

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

    "&.Mui-selected": {
      borderColor: "#1677FB",
      color: "#1677FB",
      backgroundColor: "transparent",
      zIndex: 2,
      "&:hover": {
        backgroundColor: "rgba(22, 119, 251, 0.04)",
      },

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
