import { serverAPI } from "../request/serverAPI";

export const companyAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    company: builder.query({
      transformResponse: (response) => response?.data,
      query: (payload) => ({
        url: `/companies`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Company"],
    }),
    addCompany: builder.mutation({
      query: (payload) => ({
        url: "/companies",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Company"],
    }),
    updateCompany: builder.mutation({
      query: (payload) => ({
        url: `/companies/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Company"],
    }),
    archiveCompany: builder.mutation({
      query: (payload) => ({
        url: `/companies/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["Company"],
    }),
  }),
});

export const {
  useCompanyQuery,
  useLazyCompanyQuery,
  useAddCompanyMutation,
  useUpdateCompanyMutation,
  useArchiveCompanyMutation,
} = companyAPI;
