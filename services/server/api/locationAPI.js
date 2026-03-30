import { serverAPI } from "../request/serverAPI";
import { setLocationData } from "../slice/valuesSlice";

export const locationAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    location: builder.query({
      transformResponse: (response) => response?.data,
      query: (payload) => ({
        url: `/location`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Location"],
      async onQueryStarted(payload, { dispatch, getState, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) dispatch(setLocationData(data));
          else dispatch(setLocationData(data?.result));
        } catch (error) {}
      },
    }),
    addLocation: builder.mutation({
      query: (payload) => ({
        url: "/location",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Location"],
    }),
    updateLocation: builder.mutation({
      query: (payload) => ({
        url: `/location/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Location"],
    }),
    archiveLocation: builder.mutation({
      query: (payload) => ({
        url: `/location/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["Location"],
    }),
    importLocation: builder.mutation({
      query: (payload) => ({
        url: "/location/import",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Location"],
    }),
  }),
});

export const {
  useLocationQuery,
  useLazyLocationQuery,
  useAddLocationMutation,
  useUpdateLocationMutation,
  useArchiveLocationMutation,
  useImportLocationMutation,
} = locationAPI;
