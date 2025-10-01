import { serverAPI } from "../request/serverAPI";

export const accountGroupAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    accountGroup: builder.query({
      transformResponse: (response) => response?.data,
      query: (payload) => ({
        url: `/account_group`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["AccountGroup"],
    }),
    addAccountGroup: builder.mutation({
      query: (payload) => ({
        url: "/account_group",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["AccountGroup"],
    }),
    updateAccountGroup: builder.mutation({
      query: (payload) => ({
        url: `/account_group/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["AccountGroup"],
    }),
    archiveAccountGroup: builder.mutation({
      query: (payload) => ({
        url: `/account_group/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["AccountGroup"],
    }),
    importAccountGroup: builder.mutation({
      query: (payload) => ({
        url: `import/account_group`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["AccountGroup"],
    }),
  }),
});

export const {
  useAccountGroupQuery,
  useLazyAccountGroupQuery,
  useAddAccountGroupMutation,
  useArchiveAccountGroupMutation,
  useImportAccountGroupMutation,
  useUpdateAccountGroupMutation,
} = accountGroupAPI;
