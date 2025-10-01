import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: localStorage?.getItem("theme") || "light",
  display: localStorage?.getItem("display") || 0,
  background: "",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    setDisplay: (state, action) => {
      state.display = action.payload;
    },
    setBackground: (state, action) => {
      state.background = action.payload;
    },
    resetTheme: () => {
      return initialState;
    },
  },
});

export const { resetTheme, setMode, setDisplay, setBackground } =
  themeSlice.actions;

export default themeSlice.reducer;
