import { serverAPI } from "../request/serverAPI";

export const creditAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    credit: builder.query({
      transformResponse: (response) => response?.data,
      query: (payload) => ({
        url: `/credit`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Credit"],
    }),
    addCredit: builder.mutation({
      query: (payload) => ({
        url: "/credit",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Credit"],
    }),
    updateCredit: builder.mutation({
      query: (payload) => ({
        url: `/credit/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Credit"],
    }),
    archiveCredit: builder.mutation({
      query: (payload) => ({
        url: `/credit/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["Credit"],
    }),
    importCredit: builder.mutation({
      query: (payload) => ({
        url: `import/credit`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Credit"],
    }),
  }),
});

export const {
  useCreditQuery,
  useAddCreditMutation,
  useArchiveCreditMutation,
  useImportCreditMutation,
  useLazyCreditQuery,
  useUpdateCreditMutation,
} = creditAPI;
