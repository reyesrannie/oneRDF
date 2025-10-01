import { serverAPI } from "../request/serverAPI";

export const SubUnitAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    subUnit: builder.query({
      transformResponse: (response) => response?.data,
      query: (payload) => ({
        url: `/sub_unit`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["SubUnit"],
    }),
    addSubUnit: builder.mutation({
      query: (payload) => ({
        url: "/sub_unit",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SubUnit"],
    }),
    updateSubUnit: builder.mutation({
      query: (payload) => ({
        url: `/sub_unit/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["SubUnit"],
    }),
    archiveSubUnit: builder.mutation({
      query: (payload) => ({
        url: `/sub_unit/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["SubUnit"],
    }),
    importSubUnit: builder.mutation({
      query: (payload) => ({
        url: "/sub_unit/import",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SubUnit"],
    }),
  }),
});

export const {
  useSubUnitQuery,
  useLazySubUnitQuery,
  useAddSubUnitMutation,
  useUpdateSubUnitMutation,
  useArchiveSubUnitMutation,
  useImportSubUnitMutation,
} = SubUnitAPI;
