import { serverAPI } from "../request/serverAPI";

export const accountSubGroupAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    accountSubGroup: builder.query({
      transformResponse: (response) => response?.data,
      query: (payload) => ({
        url: `/account_sub_group`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["AccountGroup"],
    }),
    addAccountSubGroup: builder.mutation({
      query: (payload) => ({
        url: "/account_sub_group",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["AccountGroup"],
    }),
    updateAccountSubGroup: builder.mutation({
      query: (payload) => ({
        url: `/account_sub_group/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["AccountGroup"],
    }),
    archiveAccountSubGroup: builder.mutation({
      query: (payload) => ({
        url: `/account_sub_group/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["AccountGroup"],
    }),
    importAccountSubGroup: builder.mutation({
      query: (payload) => ({
        url: `import/account_sub_group`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["AccountGroup"],
    }),
  }),
});

export const {
  useAccountSubGroupQuery,
  useLazyAccountSubGroupQuery,
  useAddAccountSubGroupMutation,
  useUpdateAccountSubGroupMutation,
  useArchiveAccountSubGroupMutation,
  useImportAccountSubGroupMutation,
} = accountSubGroupAPI;
