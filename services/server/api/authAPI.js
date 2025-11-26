import { serverAPI } from "../request/serverAPI";

export const authAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (payload) => ({
        url: "/login",
        method: "POST",
        body: payload,
      }),
    }),
    loginAll: builder.mutation({
      query: (payload) => ({
        url: "/login_all",
        method: "POST",
        body: payload,
      }),
    }),
    passwordChange: builder.mutation({
      query: (payload) => ({
        url: `change_password/${payload?.id}`,
        method: "PATCH",
        body: payload,
      }),
    }),

    logout: builder.mutation({
      query: (payload) => ({
        url: "/logout",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLoginAllMutation,
  usePasswordChangeMutation,
  useLogoutMutation,
} = authAPI;
