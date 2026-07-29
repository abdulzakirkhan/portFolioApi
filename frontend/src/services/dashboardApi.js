import { apiSlice } from './api';

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => '/api/dashboard/stats',
      providesTags: ['Dashboard'],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
} = dashboardApi;
