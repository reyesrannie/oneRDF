import { serverAPI } from "../../request/serverAPI";

export const supplierAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    suppliers: builder.query({
      transformResponse: (response) => response?.data,
      query: (payload) => ({
        url: `suppliers`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Suppliers"],
    }),
    addSuppliers: builder.mutation({
      query: (payload) => ({
        url: "suppliers",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Suppliers"],
    }),
    updateSuppliers: builder.mutation({
      query: (payload) => ({
        url: `suppliers/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Suppliers"],
    }),
    archiveSuppliers: builder.mutation({
      query: (payload) => ({
        url: `suppliers/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["Suppliers"],
    }),
  }),
});

export const {
  useSuppliersQuery,
  useAddSuppliersMutation,
  useUpdateSuppliersMutation,
  useArchiveSuppliersMutation,
} = supplierAPI;
