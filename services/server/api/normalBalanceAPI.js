import { serverAPI } from "../request/serverAPI";

export const normalBalanceAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    normalBalance: builder.query({
      transformResponse: (response) => response?.data,
      query: (payload) => ({
        url: `/normal_balance`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["NormalBalance"],
    }),
    addNormalBalance: builder.mutation({
      query: (payload) => ({
        url: "/normal_balance",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["NormalBalance"],
    }),
    updateNormalBalance: builder.mutation({
      query: (payload) => ({
        url: `/normal_balance/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["NormalBalance"],
    }),
    archiveNormalBalance: builder.mutation({
      query: (payload) => ({
        url: `/normal_balance/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["NormalBalance"],
    }),
    importNormalBalance: builder.mutation({
      query: (payload) => ({
        url: `import/normal_balance`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["NormalBalance"],
    }),
  }),
});

export const {
  useNormalBalanceQuery,
  useLazyNormalBalanceQuery,
  useAddNormalBalanceMutation,
  useArchiveNormalBalanceMutation,
  useImportNormalBalanceMutation,
  useUpdateNormalBalanceMutation,
} = normalBalanceAPI;
