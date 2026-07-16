import { serverAPI } from "../../request/serverAPI";

export const itemAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    item: builder.query({
      transformResponse: (response) => response?.data,
      query: (payload) => ({
        url: `item`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Item"],
    }),
    addItem: builder.mutation({
      query: (payload) => ({
        url: "item",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Item"],
    }),
    updateItem: builder.mutation({
      query: (payload) => ({
        url: `item/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Item"],
    }),
    archiveItem: builder.mutation({
      query: (payload) => ({
        url: `item/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["Item"],
    }),
    checkItemImport: builder.mutation({
      query: (payload) => ({
        url: `/import/item`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Item"],
    }),
    syncItem: builder.mutation({
      query: (payload) => ({
        url: "store_item_sync",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Item"],
    }),
  }),
});

export const {
  useItemQuery,
  useAddItemMutation,
  useUpdateItemMutation,
  useArchiveItemMutation,
  useCheckItemImportMutation,
  useSyncItemMutation,
} = itemAPI;
