import { apiSlice } from './api';

export const portfolioApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPortfolios: builder.query({
      query: () => '/api/portfolio',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Portfolio', id: _id })),
              { type: 'Portfolio', id: 'LIST' }
            ]
          : [{ type: 'Portfolio', id: 'LIST' }],
      transformResponse: (response) => response.data || []
    }),
    createPortfolio: builder.mutation({
      query: (formData) => ({
        url: '/api/portfolio',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Portfolio', id: 'LIST' }],
    }),
    updatePortfolio: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/api/portfolio/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Portfolio', id },
        { type: 'Portfolio', id: 'LIST' }
      ],
    }),
    deletePortfolio: builder.mutation({
      query: (id) => ({
        url: `/api/portfolio/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Portfolio', id },
        { type: 'Portfolio', id: 'LIST' }
      ],
    }),
  }),
});

export const {
  useGetPortfoliosQuery,
  useCreatePortfolioMutation,
  useUpdatePortfolioMutation,
  useDeletePortfolioMutation,
} = portfolioApi;
