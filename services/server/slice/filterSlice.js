import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "active",
  view: "icon",
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setView: (state, action) => {
      state.view = action.payload;
    },
    resetFilter: () => {
      return initialState;
    },
  },
});

export const { setStatus, setView, resetFilter } = filterSlice.actions;

export default filterSlice.reducer;
