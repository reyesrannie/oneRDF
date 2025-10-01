import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  systems: null,
  initializedAPI: null,
};

const systemSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSystems: (state, action) => {
      state.systems = action.payload;
    },
    setInitializedAPI: (state, action) => {
      state.initializedAPI = action.payload;
    },
    resetSystem: () => {
      return initialState;
    },
  },
});

export const { setSystems, setInitializedAPI, resetSystem } =
  systemSlice.actions;

export default systemSlice.reducer;
