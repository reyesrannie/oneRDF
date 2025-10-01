import { serverAPI } from "../request/serverAPI";

export const syncingAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    synCharging: builder.query({
      transformResponse: (response) => response?.data,
      query: (payload) => ({
        url: `/sync_charging`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["SyncCharging"],
    }),
    applySynCharging: builder.query({
      transformResponse: (response) => response?.data,
      query: (payload) => ({
        url: `/sync_charge/${payload?.id}`,
        method: "GET",
      }),
      providesTags: ["SyncCharging"],
    }),
    addSynCharging: builder.mutation({
      query: (payload) => ({
        url: "/sync_charging",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SyncCharging"],
    }),
    updateSynCharging: builder.mutation({
      query: (payload) => ({
        url: `/sync_charging/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["SyncCharging"],
    }),
    archiveSynCharging: builder.mutation({
      query: (payload) => ({
        url: `/sync_charging/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["SyncCharging"],
    }),
  }),
});

export const {
  useSynChargingQuery,
  useAddSynChargingMutation,
  useUpdateSynChargingMutation,
  useArchiveSynChargingMutation,
  useLazyApplySynChargingQuery,
} = syncingAPI;
