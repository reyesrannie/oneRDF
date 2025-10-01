import { serverAPI } from "../request/serverAPI";

export const accountChargingAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    charge: builder.query({
      transformResponse: (response) => response?.data,
      query: (payload) => ({
        url: `/charge`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Charge"],
    }),
    addCharge: builder.mutation({
      query: (payload) => ({
        url: "/charge",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Charge"],
    }),
    updateCharge: builder.mutation({
      query: (payload) => ({
        url: `/charge/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Charge"],
    }),
    archiveCharge: builder.mutation({
      query: (payload) => ({
        url: `/charge/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["Charge"],
    }),
    importCharge: builder.mutation({
      query: (payload) => ({
        url: `import/charge`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Charge"],
    }),
  }),
});

export const {
  useChargeQuery,
  useAddChargeMutation,
  useArchiveChargeMutation,
  useImportChargeMutation,
  useLazyChargeQuery,
  useUpdateChargeMutation,
} = accountChargingAPI;
