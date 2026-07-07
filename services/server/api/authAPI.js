import { serverAPI } from "../request/serverAPI";
import { setToken, setUserData } from "../slice/authSlice";

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
    refreshUser: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/refresh_user`,
        method: "GET",
        params: payload,
      }),
      async onQueryStarted(payload, { dispatch, getState, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data) {
            dispatch(setUserData(data?.data));
          }
        } catch (error) {}
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useLoginAllMutation,
  usePasswordChangeMutation,
  useLogoutMutation,
  useRefreshUserQuery,
} = authAPI;
