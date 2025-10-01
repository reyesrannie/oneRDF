import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const systemAPI = createApi({
  reducerPath: "systemAPI",
  baseQuery: fetchBaseQuery({
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    testConnection: builder.mutation({
      query: ({ baseUrl, apiKey }) => ({
        url: baseUrl,
        method: "POST",
        headers: {
          "api-key": apiKey,
        },
      }),
    }),
    systemLogin: builder.mutation({
      query: ({ baseUrl, credentials }) => ({
        url: baseUrl,
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useTestConnectionMutation, useSystemLoginMutation } = systemAPI;
