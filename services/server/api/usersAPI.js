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
    updateUser: builder.mutation({
      query: (payload) => ({
        url: `/user/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useUserQuery,
  useUserResetMutation,
  useCreateUserMutation,
  useUpdateUserMutation,
} = userAPI;
