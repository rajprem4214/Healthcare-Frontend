'use client';
import { createApi } from '@reduxjs/toolkit/query/react';
import { fetchBaseQuery } from '../utils';

const authApiQ = createApi({
  reducerPath: 'AuthApiQ',
  baseQuery: fetchBaseQuery(),
  tagTypes: ['Profile'],
  endpoints: (builder) => ({
    getOtp: builder.query<void, string>({
      query: (email) =>
        '/auth/getOtp?' + new URLSearchParams({ email }).toString(),
    }),
    getProfile: builder.query<
      ProfileResponse,
      void
    >({
      query: () => ({
        url: '/auth/me',
      }),
      providesTags: () => [{ type: 'Profile', id: 'User' }],
      transformResponse: (data: ApiResponse<ProfileResponse>) => {
        return data?.data
      },
    }),
    updateProfile: builder.mutation({
      query: ({ userId, fullName, email, phoneNumber, profilePictureUrl, emailVerified}: {
        userId: string,
        fullName?: string,
        email?: string,
        phoneNumber?: string | null,
        profilePictureUrl?: string | null,
        emailVerified?: number,
      }) => ({
        url: `/auth/${userId}`,
        method: 'PATCH',
        body: {
          fullName,
          email,
          phoneNumber,
          profilePictureUrl,
          emailVerified,
        }
      }),
      invalidatesTags: ['Profile']
    }),
    loginUser: builder.mutation<
      LoginResponse,
      {
        email: string;
        otp: string;
      }
    >({
      query: ({ email, otp }) => ({
        url: '/auth/login',
        method: 'POST',
        body: {
          email,
          otp,
        },
      }),
      transformResponse: (data: ApiResponse<LoginResponse>) => {
        return data?.data;
      },
    }),
    verifyOtp: builder.mutation<
      { message: string },
      {
        email: string;
        otp: string;
        clearAuthTokens?: boolean;
      }
    >({
      query: ({ email, otp, clearAuthTokens }: {
        email: string,
        otp: string,
        clearAuthTokens?: boolean;
      }) => ({
        url: '/auth/verifyOtp',
        method: 'POST',
        body: {
          email,
          otp,
          clearAuthTokens,
        },
      }),
      transformResponse: (data: ApiResponse<{ message: string }>) => {
        return data?.data;
      },
    }),
  }),
});

export const { useLazyGetOtpQuery, useGetProfileQuery, useUpdateProfileMutation, useLoginUserMutation, useVerifyOtpMutation } = authApiQ;
export { authApiQ };
