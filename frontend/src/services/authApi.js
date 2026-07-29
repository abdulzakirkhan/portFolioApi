import { apiSlice } from './api';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (credentials) => ({
        url: '/api/auth/signup',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    signin: builder.mutation({
      query: (credentials) => ({
        url: '/api/auth/signin',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    getMe: builder.query({
      query: () => '/api/auth/me',
      providesTags: ['User'],
      transformResponse: (response) => response, // Keep the response structure as-is
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/api/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
  }),
});

export const {
  useSignupMutation,
  useSigninMutation,
  useGetMeQuery,
  useLogoutMutation,
} = authApi;
