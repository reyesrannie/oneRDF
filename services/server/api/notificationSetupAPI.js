import { serverAPI } from "../request/serverAPI";

export const notificationSetupAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    notification: builder.query({
      transformResponse: (response) => response?.data,
      query: (payload) => ({
        url: `/notification`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Notification"],
    }),
    addNotification: builder.mutation({
      query: (payload) => ({
        url: "/notification",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Notification"],
    }),
    updateNotification: builder.mutation({
      query: (payload) => ({
        url: `/notification/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Notification"],
    }),
    archiveNotification: builder.mutation({
      query: (payload) => ({
        url: `/notification/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useNotificationQuery,
  useAddNotificationMutation,
  useUpdateNotificationMutation,
  useArchiveNotificationMutation,
} = notificationSetupAPI;
