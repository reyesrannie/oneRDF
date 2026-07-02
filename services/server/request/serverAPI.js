import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const serverAPI = createApi({
  reducerPath: "serverAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseURL}/api`,
    // baseUrl: baseURL,
    mode: "cors",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      // const token = getState().auth.token;
      // if (token) {
      //   headers.set("Authorization", `Bearer ${token}`);
      // }
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: [
    "Users",
    "UsersSystems",
    "Systems",
    "Company",
    "Category",
    "BusinessUnit",
    "Department",
    "DepartmentUnit",
    "SystemsImages",
    "AccountGroup",
    "Audit",
  ],
  endpoints: (builder) => ({}),
});

export const { useReportQuery } = serverAPI;
