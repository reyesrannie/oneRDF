import { serverAPI } from "../request/serverAPI";

export const accountUnitAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    accountUnit: builder.query({
      transformResponse: (response) => response?.data,
      query: (payload) => ({
        url: `/account_unit`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["AccountUnit"],
    }),
    addAccountUnit: builder.mutation({
      query: (payload) => ({
        url: "/account_unit",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["AccountUnit"],
    }),
    updateAccountUnit: builder.mutation({
      query: (payload) => ({
        url: `/account_unit/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["AccountUnit"],
    }),
    archiveAccountUnit: builder.mutation({
      query: (payload) => ({
        url: `/account_unit/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["AccountUnit"],
    }),
    importAccountUnit: builder.mutation({
      query: (payload) => ({
        url: `import/account_unit`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["AccountUnit"],
    }),
  }),
});

export const {
  useAccountUnitQuery,
  useLazyAccountUnitQuery,
  useAddAccountUnitMutation,
  useUpdateAccountUnitMutation,
  useArchiveAccountUnitMutation,
  useImportAccountUnitMutation,
} = accountUnitAPI;
