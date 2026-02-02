import { serverAPI } from "../../request/serverAPI";

export const referenceAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    reference: builder.query({
      transformResponse: (response) => response?.data,
      query: (payload) => ({
        url: `supplier/reference`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Reference"],
    }),
    addReference: builder.mutation({
      query: (payload) => ({
        url: "supplier/reference",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Reference"],
    }),
    updateReference: builder.mutation({
      query: (payload) => ({
        url: `supplier/reference/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Reference"],
    }),
    archiveReference: builder.mutation({
      query: (payload) => ({
        url: `supplier/reference/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["Reference"],
    }),
  }),
});

export const {
  useReferenceQuery,
  useAddReferenceMutation,
  useUpdateReferenceMutation,
  useArchiveReferenceMutation,
} = referenceAPI;
