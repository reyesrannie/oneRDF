import { serverAPI } from "../request/serverAPI";
import { setUsersData } from "../slice/valuesSlice";

export const userAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    user: builder.query({
      transformResponse: (response) => response?.data,
      query: (payload) => ({
        url: `/user`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Users"],
      async onQueryStarted(payload, { dispatch, getState, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (Array.isArray(data?.data)) dispatch(setUsersData(data?.data));
          else dispatch(setUsersData(data?.result));
        } catch (error) {}
      },
    }),
    userReset: builder.mutation({
      query: (payload) => ({
        url: `reset_password/${payload?.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Users"],
    }),
    createUser: builder.mutation({
      query: (payload) => ({
        url: `/user`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Users"],
    }),

    checkUsersImport: builder.mutation({
      query: (payload) => ({
        url: `/existing_users_check`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Users"],
    }),
    createUserSystems: builder.mutation({
      query: (payload) => ({
        url: `/sample`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["UsersSystems", "Audit"],
    }),
    updateUser: builder.mutation({
      query: (payload) => ({
        url: `/user/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Users", "Audit"],
    }),
    archiveUser: builder.mutation({
      query: (payload) => ({
        url: `/user/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["Users", "Audit"],
    }),
    resetAllSystem: builder.mutation({
      query: (payload) => ({
        url: `/reset_all_password`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["UsersSystems", "Audit"],
    }),

    passwordChangeAll: builder.mutation({
      query: (payload) => ({
        url: `/change_all_password`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["UsersSystems", "Audit"],
    }),
    generateOTP: builder.mutation({
      query: (payload) => ({
        url: `/generate_support_token`,
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useUserQuery,
  useLazyUserQuery,
  useUserResetMutation,
  useCheckUsersImportMutation,
  useCreateUserMutation,
  useCreateUserSystemsMutation,
  useUpdateUserMutation,
  useArchiveUserMutation,
  usePasswordChangeAllMutation,
  useResetAllSystemMutation,
  useGenerateOTPMutation,
} = userAPI;
