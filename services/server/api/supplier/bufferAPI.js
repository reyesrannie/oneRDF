import { serverAPI } from "../../request/serverAPI";

export const bufferAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    buffer: builder.query({
      transformResponse: (response) => response?.data,
      query: (payload) => ({
        url: `supplier/buffer`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Buffer"],
    }),
    addBuffer: builder.mutation({
      query: (payload) => ({
        url: "supplier/buffer",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Buffer"],
    }),
    updateBuffer: builder.mutation({
      query: (payload) => ({
        url: `supplier/buffer/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Buffer"],
    }),
    archiveBuffer: builder.mutation({
      query: (payload) => ({
        url: `supplier/buffer/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["Buffer"],
    }),
  }),
});

export const {
  useBufferQuery,
  useAddBufferMutation,
  useUpdateBufferMutation,
  useArchiveBufferMutation,
} = bufferAPI;
