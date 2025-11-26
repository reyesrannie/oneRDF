import { serverAPI } from "../request/serverAPI";

export const auditAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    audit: builder.query({
      transformResponse: (response) => response?.data,
      query: (payload) => ({
        url: `/audit`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Audit"],
    }),
    addAudit: builder.mutation({
      query: (payload) => ({
        url: "/audit",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Audit"],
    }),
    updateAudit: builder.mutation({
      query: (payload) => ({
        url: `/audit/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Audit"],
    }),
    archiveAudit: builder.mutation({
      query: (payload) => ({
        url: `/audit/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["Audit"],
    }),
  }),
});

export const {
  useAuditQuery,
  useAddAuditMutation,
  useUpdateAuditMutation,
  useArchiveAuditMutation,
} = auditAPI;
