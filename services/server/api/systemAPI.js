import { serverAPI } from "../request/serverAPI";

export const systemAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    systems: builder.query({
      transformResponse: (response) => response?.data,
      query: (payload) => ({
        url: `/system`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Systems"],
    }),
    addSystem: builder.mutation({
      query: (payload) => ({
        url: "/system",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Systems", "SystemsImages"],
    }),
    updateSystem: builder.mutation({
      query: (payload) => ({
        url: `/system/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Systems", "SystemsImages"],
    }),
    storeFile: builder.mutation({
      query: (payload) => ({
        url: "/store_file",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SystemsImages"],
    }),
    getFile: builder.query({
      query: (payload) => ({
        url: `/get_file/${payload?.fileName}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
      transformResponse: (blob) => {
        const imageURL = URL.createObjectURL(blob);
        return { imageURL };
      },
      providesTags: ["SystemsImages"],
    }),
  }),
});

export const {
  useSystemsQuery,
  useAddSystemMutation,
  useUpdateSystemMutation,
  useStoreFileMutation,
  useLazySystemsQuery,
  useLazyGetFileQuery,
} = systemAPI;
