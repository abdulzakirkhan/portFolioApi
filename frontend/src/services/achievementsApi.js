import { apiSlice } from './api';

export const achievementsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAchievements: builder.query({
      query: () => '/api/achievements',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Achievement', id: _id })),
              { type: 'Achievement', id: 'LIST' }
            ]
          : [{ type: 'Achievement', id: 'LIST' }],
      transformResponse: (response) => response.data || []
    }),
    createAchievement: builder.mutation({
      query: (payload) => ({
        url: '/api/achievements',
        method: 'POST',
        body: payload
      }),
      invalidatesTags: [{ type: 'Achievement', id: 'LIST' }]
    }),
    updateAchievement: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/api/achievements/${id}`,
        method: 'PUT',
        body: payload
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Achievement', id },
        { type: 'Achievement', id: 'LIST' }
      ]
    }),
    deleteAchievement: builder.mutation({
      query: (id) => ({
        url: `/api/achievements/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Achievement', id },
        { type: 'Achievement', id: 'LIST' }
      ]
    })
  })
});

export const {
  useGetAchievementsQuery,
  useCreateAchievementMutation,
  useUpdateAchievementMutation,
  useDeleteAchievementMutation
} = achievementsApi;
