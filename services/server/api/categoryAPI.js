import { serverAPI } from "../request/serverAPI";

export const categoryAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    category: builder.query({
      transformResponse: (response) => response?.data,
      query: (payload) => ({
        url: `/category`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Category"],
    }),
    addCategory: builder.mutation({
      query: (payload) => ({
        url: "/category",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation({
      query: (payload) => ({
        url: `/category/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Category"],
    }),
    archiveCategory: builder.mutation({
      query: (payload) => ({
        url: `/category/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useCategoryQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useArchiveCategoryMutation,
} = categoryAPI;
