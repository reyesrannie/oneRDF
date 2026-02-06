import { createSlice } from "@reduxjs/toolkit";
import { set } from "react-hook-form";

const initialState = {
  renderLogo: true,
  fadeOut: false,
  systemDisplay: "slider",
  selectedSystem: null,
};

const renderSlice = createSlice({
  name: "render",
  initialState,
  reducers: {
    setRenderLogo: (state, action) => {
      state.renderLogo = action.payload;
    },
    setFadeOut: (state, action) => {
      state.fadeOut = action.payload;
    },
    setSystemDisplay: (state, action) => {
      state.systemDisplay = action.payload;
    },
    setSelectedSystem: (state, action) => {
      state.selectedSystem = action.payload;
    },
    resetRender: () => {
      return initialState;
    },
  },
});

export const {
  setRenderLogo,
  setFadeOut,
  setSystemDisplay,
  setSelectedSystem,
  resetRender,
} = renderSlice.actions;

export default renderSlice.reducer;
