import { serverAPI } from "../request/serverAPI";

export const geoAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    region: builder.query({
      transformResponse: (response) => response?.data,
      query: (payload) => ({
        url: `/region`,
        method: "GET",
        params: payload,
      }),
    }),
    province: builder.query({
      transformResponse: (response) => response?.data,
      query: (payload) => ({
        url: `/province`,
        method: "GET",
        params: payload,
      }),
    }),
    cityMunicipality: builder.query({
      transformResponse: (response) => response?.data,
      query: (payload) => ({
        url: `/city_municipality`,
        method: "GET",
        params: payload,
      }),
    }),
    subMunicipality: builder.query({
      transformResponse: (response) => response?.data,
      query: (payload) => ({
        url: `/sub_municipality`,
        method: "GET",
        params: payload,
      }),
    }),
    barangay: builder.query({
      transformResponse: (response) => response?.data,
      query: (payload) => ({
        url: `/barangay`,
        method: "GET",
        params: payload,
      }),
    }),
  }),
});

export const {
  useRegionQuery,
  useProvinceQuery,
  useCityMunicipalityQuery,
  useSubMunicipalityQuery,
  useBarangayQuery,
} = geoAPI;
