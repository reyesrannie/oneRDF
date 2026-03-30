import { serverAPI } from "../request/serverAPI";
import { setBusinessData } from "../slice/valuesSlice";

export const categoryAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    businessUnit: builder.query({
      transformResponse: (response) => response?.data,
      query: (payload) => ({
        url: `/business_unit`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["BusinessUnit"],
      async onQueryStarted(payload, { dispatch, getState, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) dispatch(setBusinessData(data));
          else dispatch(setBusinessData(data?.result));
        } catch (error) {}
      },
    }),
    addBusinessUnit: builder.mutation({
      query: (payload) => ({
        url: "/business_unit",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["BusinessUnit"],
    }),
    updateBusinessUni: builder.mutation({
      query: (payload) => ({
        url: `/business_unit/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["BusinessUnit"],
    }),
    archiveBusinessUni: builder.mutation({
      query: (payload) => ({
        url: `/business_unit/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["BusinessUnit"],
    }),
    importBusinessUnit: builder.mutation({
      query: (payload) => ({
        url: "/business_unit/import",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["BusinessUnit"],
    }),
  }),
});

export const {
  useBusinessUnitQuery,
  useLazyBusinessUnitQuery,
  useAddBusinessUnitMutation,
  useArchiveBusinessUniMutation,
  useUpdateBusinessUniMutation,
  useImportBusinessUnitMutation,
} = categoryAPI;
