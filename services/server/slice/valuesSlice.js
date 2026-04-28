// valuesSlice.js

import { createSlice } from "@reduxjs/toolkit";
import {
  mergeUniqueByKey,
  mergeUniqueByKeyID,
} from "../../functions/reusableFunction";

const initialState = {
  sedarData: [],
  companyData: [],
  businessData: [],
  departmentData: [],
  unitData: [],
  subUnitData: [],
  locationData: [],
};

const valuesSlice = createSlice({
  name: "values",
  initialState,
  reducers: {
    setSedarData: (state, action) => {
      const incomingData = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];

      state.sedarData = mergeUniqueByKey(
        state.sedarData,
        incomingData,
        "general_info.full_id_number_full_name",
      );
    },
    setCompanyData: (state, action) => {
      state.companyData = mergeUniqueByKeyID(
        state.companyData,
        action.payload,
        "code",
      );
    },
    setBusinessData: (state, action) => {
      state.businessData = mergeUniqueByKeyID(
        state.businessData,
        action.payload,
        "code",
      );
    },
    setDepartmentData: (state, action) => {
      state.departmentData = mergeUniqueByKeyID(
        state.departmentData,
        action.payload,
        "id",
      );
    },
    setUnitData: (state, action) => {
      state.unitData = mergeUniqueByKeyID(state.unitData, action.payload, "id");
    },
    setSubUnitData: (state, action) => {
      state.subUnitData = mergeUniqueByKeyID(
        state.subUnitData,
        action.payload,
        "id",
      );
    },
    setLocationData: (state, action) => {
      state.locationData = mergeUniqueByKeyID(
        state.locationData,
        action.payload,
        "id",
      );
    },
    resetValues: () => {
      return initialState;
    },
  },
});

export const {
  resetValues,
  setSedarData,
  setBusinessData,
  setCompanyData,
  setDepartmentData,
  setLocationData,
  setSubUnitData,
  setUnitData,
} = valuesSlice.actions;

export default valuesSlice.reducer;
