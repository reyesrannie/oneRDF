import { serverAPI } from "../../request/serverAPI";

export const uomAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    uom: builder.query({
      transformResponse: (response) => response?.data,
      query: (payload) => ({
        url: `uom`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Uom"],
    }),
    addUom: builder.mutation({
      query: (payload) => ({
        url: "uom",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Uom"],
    }),
    updateUom: builder.mutation({
      query: (payload) => ({
        url: `uom/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Uom"],
    }),
    archiveUom: builder.mutation({
      query: (payload) => ({
        url: `uom/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["Uom"],
    }),
  }),
});

export const {
  useUomQuery,
  useAddUomMutation,
  useUpdateUomMutation,
  useArchiveUomMutation,
} = uomAPI;
