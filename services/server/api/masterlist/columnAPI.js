import { serverAPI } from "../../request/serverAPI";

export const columnAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    column: builder.query({
      transformResponse: (response) => response?.data,
      query: (payload) => ({
        url: `/column`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Column"],
    }),
    addColumn: builder.mutation({
      query: (payload) => ({
        url: "/column",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Column"],
    }),
    updateColumn: builder.mutation({
      query: (payload) => ({
        url: `/column/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Column"],
    }),
    archiveColumn: builder.mutation({
      query: (payload) => ({
        url: `/column/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["Column"],
    }),
  }),
});

export const {
  useColumnQuery,
  useAddColumnMutation,
  useUpdateColumnMutation,
  useArchiveColumnMutation,
} = columnAPI;
