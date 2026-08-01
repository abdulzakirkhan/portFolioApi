import { apiSlice } from './api';

export const experienceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getExperiences: builder.query({
      query: () => ({
        url: '/api/experiences',
        method: 'GET'
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Experience', id: _id })),
              { type: 'Experience', id: 'LIST' }
            ]
          : [{ type: 'Experience', id: 'LIST' }],
      transformResponse: (response) => response.data || []
    }),
    createExperience: builder.mutation({
      query: (formData) => ({
        url: '/api/experiences',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Experience', id: 'LIST' }],
    }),
    updateExperience: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/api/experiences/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Experience', id },
        { type: 'Experience', id: 'LIST' }
      ],
    }),
    deleteExperience: builder.mutation({
      query: (id) => ({
        url: `/api/experiences/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Experience', id },
        { type: 'Experience', id: 'LIST' }
      ],
    }),
  })
});

export const {
  useGetExperiencesQuery,
  useCreateExperienceMutation,
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
} = experienceApi;
