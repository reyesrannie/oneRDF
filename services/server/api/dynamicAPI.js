import { systemAPI } from "../request/systemAPI";

export const dynamicAPI = systemAPI.injectEndpoints({
  endpoints: (builder) => ({
    getData: builder.query({
      query: (payload) => {
        return {
          url: `${payload?.endpoint}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${payload?.token}`,
            Accept: "application/json",
          },
        };
      },
      transformResponse: (response) => response?.data,
    }),
  }),
});

export const { useLazyGetDataQuery } = systemAPI;
