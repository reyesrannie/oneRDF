import { serverAPI } from "../request/serverAPI";
import { setDepartmentData } from "../slice/valuesSlice";

export const departmentAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    department: builder.query({
      transformResponse: (response) => response?.data,
      query: (payload) => ({
        url: `/departments`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Department"],
      async onQueryStarted(payload, { dispatch, getState, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) dispatch(setDepartmentData(data));
          else dispatch(setDepartmentData(data?.result));
        } catch (error) {}
      },
    }),
    addDeparment: builder.mutation({
      query: (payload) => ({
        url: "/departments",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Department"],
    }),
    updateDeparment: builder.mutation({
      query: (payload) => ({
        url: `/departments/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Department"],
    }),
    archiveDeparment: builder.mutation({
      query: (payload) => ({
        url: `/departments/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["Department"],
    }),
    importDeparment: builder.mutation({
      query: (payload) => ({
        url: "/department/import",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Department"],
    }),
  }),
});

export const {
  useDepartmentQuery,
  useLazyDepartmentQuery,
  useAddDeparmentMutation,
  useUpdateDeparmentMutation,
  useArchiveDeparmentMutation,
  useImportDeparmentMutation,
} = departmentAPI;
