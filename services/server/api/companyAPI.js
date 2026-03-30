import { serverAPI } from "../request/serverAPI";
import { setCompanyData } from "../slice/valuesSlice";

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
      async onQueryStarted(payload, { dispatch, getState, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) dispatch(setCompanyData(data));
          else dispatch(setCompanyData(data?.result));
        } catch (error) {}
      },
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
