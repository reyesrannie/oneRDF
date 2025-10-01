import { serverAPI } from "../request/serverAPI";

export const allocationAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    allocation: builder.query({
      transformResponse: (response) => response?.data,
      query: (payload) => ({
        url: `/allocation`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Allocation"],
    }),
    addAllocation: builder.mutation({
      query: (payload) => ({
        url: "/allocation",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Allocation"],
    }),
    updateAllocation: builder.mutation({
      query: (payload) => ({
        url: `/allocation/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Allocation"],
    }),
    archiveAllocation: builder.mutation({
      query: (payload) => ({
        url: `/allocation/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["Allocation"],
    }),
    importAllocation: builder.mutation({
      query: (payload) => ({
        url: `import/allocation`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Allocation"],
    }),
  }),
});

export const {
  useAllocationQuery,
  useAddAllocationMutation,
  useArchiveAllocationMutation,
  useImportAllocationMutation,
  useLazyAllocationQuery,
  useUpdateAllocationMutation,
} = allocationAPI;
