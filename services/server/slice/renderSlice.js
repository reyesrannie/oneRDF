import { createSlice } from "@reduxjs/toolkit";
import { set } from "react-hook-form";

const initialState = {
  renderLogo: true,
  fadeOut: false,
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
    resetRender: () => {
      return initialState;
    },
  },
});

export const { setRenderLogo, setFadeOut, resetRender } = renderSlice.actions;

export default renderSlice.reducer;
