import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base query with authorization header
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Base query with re-authentication
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If token expired or unauthorized, try to handle it
  if (result.error && result.error.status === 401) {
    // Token expired - logout user
    api.dispatch({ type: 'auth/logout' });
  }

  return result;
};

// Create API slice
export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'User', 'Dashboard'],
  endpoints: (builder) => ({
    // Auth endpoints will be added here
  }),
});

export default apiSlice;
