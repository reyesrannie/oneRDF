import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  syncOneCharging: false,
  syncOneChargingData: null,
  syncModal: false,
  syncModalData: null,
  canConnect: false,
  progressDialog: false,
  progressPercent: 0,
  userSetupModal: false,
  userSetupData: null,
};

const syncSlice = createSlice({
  name: "sync",
  initialState,
  reducers: {
    setSyncOneCharging: (state, action) => {
      state.syncOneCharging = action.payload;
    },
    setSyncOneChargingData: (state, action) => {
      state.syncOneChargingData = action.payload;
    },
    setSyncModal: (state, action) => {
      state.syncModal = action.payload;
    },
    setSyncModalData: (state, action) => {
      state.syncModalData = action.payload;
    },
    setCanConnect: (state, action) => {
      state.canConnect = action.payload;
    },
    setProgressDialog: (state, action) => {
      state.progressDialog = action.payload;
    },
    setProgressPercent: (state, action) => {
      state.progressPercent = action.payload;
    },
    setUserSetupModal: (state, action) => {
      state.userSetupModal = action.payload;
    },
    setUserSetupData: (state, action) => {
      state.userSetupData = action.payload;
    },
    resetSync: () => {
      return initialState;
    },
  },
});

export const {
  setSyncOneChargingData,
  setSyncOneCharging,
  setSyncModal,
  setSyncModalData,
  setCanConnect,
  setProgressDialog,
  setProgressPercent,
  setUserSetupModal,
  setUserSetupData,
  resetSync,
} = syncSlice.actions;

export default syncSlice.reducer;
