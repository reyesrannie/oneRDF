import { serverAPI } from "../request/serverAPI";

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
  }),
});

export const {
  useUserQuery,
  useUserResetMutation,
  useCreateUserMutation,
  useCreateUserSystemsMutation,
  useUpdateUserMutation,
  usePasswordChangeAllMutation,
  useResetAllSystemMutation,
} = userAPI;
