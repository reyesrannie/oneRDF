import { serverAPI } from "../request/serverAPI";

export const financialStatementAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    financialStatement: builder.query({
      transformResponse: (response) => response?.data,
      query: (payload) => ({
        url: `/financial_statement`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["FinancialStatement"],
    }),
    addFinancialStatement: builder.mutation({
      query: (payload) => ({
        url: "/financial_statement",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["FinancialStatement"],
    }),
    updateFinancialStatement: builder.mutation({
      query: (payload) => ({
        url: `/financial_statement/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["FinancialStatement"],
    }),
    archiveFinancialStatement: builder.mutation({
      query: (payload) => ({
        url: `/financial_statement/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["FinancialStatement"],
    }),
    importFinancialStatement: builder.mutation({
      query: (payload) => ({
        url: `import/financial_statement`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["FinancialStatement"],
    }),
  }),
});

export const {
  useFinancialStatementQuery,
  useLazyFinancialStatementQuery,
  useAddFinancialStatementMutation,
  useArchiveFinancialStatementMutation,
  useImportFinancialStatementMutation,
  useUpdateFinancialStatementMutation,
} = financialStatementAPI;
