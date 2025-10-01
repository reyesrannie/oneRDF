import { serverAPI } from "../request/serverAPI";

export const accountTypeAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    accountType: builder.query({
      transformResponse: (response) => response?.data,
      query: (payload) => ({
        url: `/account_type`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["AccountType"],
    }),
    addAccountType: builder.mutation({
      query: (payload) => ({
        url: "/account_type",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["AccountType"],
    }),
    updateAccountType: builder.mutation({
      query: (payload) => ({
        url: `/account_type/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["AccountType"],
    }),
    archiveAccountType: builder.mutation({
      query: (payload) => ({
        url: `/account_type/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["AccountType"],
    }),
    importAccountType: builder.mutation({
      query: (payload) => ({
        url: `import/account_type`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["AccountType"],
    }),
  }),
});

export const {
  useAccountTypeQuery,
  useLazyAccountTypeQuery,
  useAddAccountTypeMutation,
  useArchiveAccountTypeMutation,
  useUpdateAccountTypeMutation,
  useImportAccountTypeMutation,
} = accountTypeAPI;
