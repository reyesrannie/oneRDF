import { serverAPI } from "../request/serverAPI";

export const accountTitleAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    accountTitle: builder.query({
      transformResponse: (response) => response?.data,
      query: (payload) => ({
        url: `/account_title`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["AccountTitle"],
    }),
    addAccountTitle: builder.mutation({
      query: (payload) => ({
        url: "/account_title",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["AccountTitle"],
    }),
    updateAccountTitle: builder.mutation({
      query: (payload) => ({
        url: `/account_title/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["AccountTitle"],
    }),
    archiveAccountTitle: builder.mutation({
      query: (payload) => ({
        url: `/account_title/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["AccountTitle"],
    }),
    importAccountTitle: builder.mutation({
      query: (payload) => ({
        url: `import/account_title`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["AccountTitle"],
    }),
  }),
});

export const {
  useAccountTitleQuery,
  useAddAccountTitleMutation,
  useArchiveAccountTitleMutation,
  useImportAccountTitleMutation,
  useLazyAccountTitleQuery,
  useUpdateAccountTitleMutation,
} = accountTitleAPI;
