import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const baseURL = import.meta.env.VITE_API_BASE_URL;
const baseURL = "http://10.10.12.14:8000/api";
// const baseURL = "http://10.10.10.16:8080/ONERDF";

// const baseURL = "http://localhost:8080/ONERDF/public/api";
// const baseURL = "http://192.168.69.55:8080/ONERDF";

export const serverAPI = createApi({
  reducerPath: "serverAPI",
  baseQuery: fetchBaseQuery({
    // baseUrl: `${baseURL}/public/api`,
    baseUrl: baseURL,
    mode: "cors",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: [
    "Users",
    "Systems",
    "Company",
    "Category",
    "BusinessUnit",
    "Department",
    "DepartmentUnit",
    "SystemsImages",
    "AccountGroup",
  ],
  endpoints: (builder) => ({}),
});

export const { useReportQuery } = serverAPI;
