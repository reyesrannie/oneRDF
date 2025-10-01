import { serverAPI } from "../request/serverAPI";

export const coaAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    coa: builder.query({
      transformResponse: (response) => response?.data,
      query: (payload) => ({
        url: `/charging`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["COA"],
    }),
    addCoa: builder.mutation({
      query: (payload) => ({
        url: "/charging",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["COA"],
    }),
    updateCoa: builder.mutation({
      query: (payload) => ({
        url: `/charging/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["COA"],
    }),
    archiveCoa: builder.mutation({
      query: (payload) => ({
        url: `/charging/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["COA"],
    }),
    importCoa: builder.mutation({
      query: (payload) => ({
        url: `/charging/import`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["COA"],
    }),
  }),
});

export const {
  useCoaQuery,
  useAddCoaMutation,
  useUpdateCoaMutation,
  useArchiveCoaMutation,
  useImportCoaMutation,
} = coaAPI;
