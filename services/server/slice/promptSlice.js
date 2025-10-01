import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  archive: false,
  reset: false,
};

const promptSlice = createSlice({
  name: "prompt",
  initialState,
  reducers: {
    setArchive: (state, action) => {
      state.archive = action.payload;
    },
    setReset: (state, action) => {
      state.reset = action.payload;
    },
    resetPrompt: () => {
      return initialState;
    },
  },
});

export const { setArchive, setReset, resetPrompt } = promptSlice.actions;

export default promptSlice.reducer;
