import { serverAPI } from "../request/serverAPI";

export const departmentUnitAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    departmentUnit: builder.query({
      transformResponse: (response) => response?.data,
      query: (payload) => ({
        url: `/department_unit`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["DepartmentUnit"],
    }),
    addDepartmentUnit: builder.mutation({
      query: (payload) => ({
        url: "/department_unit",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["DepartmentUnit"],
    }),
    updateDeparmentUnit: builder.mutation({
      query: (payload) => ({
        url: `/department_unit/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["DepartmentUnit"],
    }),
    archiveDeparmentUnit: builder.mutation({
      query: (payload) => ({
        url: `/department_unit/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["DepartmentUnit"],
    }),
    importDepartmentUnit: builder.mutation({
      query: (payload) => ({
        url: "/department_unit/import",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["DepartmentUnit"],
    }),
  }),
});

export const {
  useDepartmentUnitQuery,
  useLazyDepartmentUnitQuery,
  useAddDepartmentUnitMutation,
  useUpdateDeparmentUnitMutation,
  useArchiveDeparmentUnitMutation,
  useImportDepartmentUnitMutation,
} = departmentUnitAPI;
