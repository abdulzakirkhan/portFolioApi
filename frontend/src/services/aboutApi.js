import { apiSlice } from './api';

export const aboutApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAboutMe: builder.query({
      query: () => '/api/about',
      providesTags: ['About'],
      transformResponse: (response) => response.data,
    }),
    createAboutMe: builder.mutation({
      query: (data) => ({
        url: '/api/about',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['About'],
    }),
    updateAboutMe: builder.mutation({
      query: (data) => ({
        url: '/api/about',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['About'],
    }),
    deleteAboutMe: builder.mutation({
      query: () => ({
        url: '/api/about',
        method: 'DELETE',
      }),
      invalidatesTags: ['About'],
    }),
  }),
});

export const {
  useGetAboutMeQuery,
  useCreateAboutMeMutation,
  useUpdateAboutMeMutation,
  useDeleteAboutMeMutation,
} = aboutApi;
