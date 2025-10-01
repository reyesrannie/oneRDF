import { serverAPI } from "../request/serverAPI";

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
