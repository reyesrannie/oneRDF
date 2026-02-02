import { serverAPI } from "../../request/serverAPI";

export const typeAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    type: builder.query({
      transformResponse: (response) => response?.data,
      query: (payload) => ({
        url: `supplier/type`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Type"],
    }),
    addType: builder.mutation({
      query: (payload) => ({
        url: "supplier/type",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Type"],
    }),
    updateType: builder.mutation({
      query: (payload) => ({
        url: `supplier/type/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Type"],
    }),
    archiveType: builder.mutation({
      query: (payload) => ({
        url: `supplier/type/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["Type"],
    }),
  }),
});

export const {
  useTypeQuery,
  useAddTypeMutation,
  useUpdateTypeMutation,
  useArchiveTypeMutation,
} = typeAPI;
