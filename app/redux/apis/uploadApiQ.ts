import { createApi } from '@reduxjs/toolkit/query/react';
import { fetchBaseQuery } from '../utils';

const fileUploadApiQ = createApi({
    reducerPath: 'fileUploadApiQ',
    baseQuery: fetchBaseQuery(),
    endpoints: (builder) => ({
        uploadFiles: builder.mutation({
            query: (formData: FormData) => ({
                    url: '/storage/upload',
                    method: 'POST',
                    body: formData,
            }),
            transformResponse: (data: ApiResponse<uploadFilesResponse>) => {
                return data?.data;
            },
        }),
        getSignedUrl: builder.query<
            getSignedUrlResponse,
            {
                id: string
            }
        >({
            query: (params) => ({
                url: "/storage/getSignedUrl/" + params.id,
            }),
            transformResponse: (data: ApiResponse<getSignedUrlResponse>) => {
                return data.data
            },
        }),
    }),
});

export const { useUploadFilesMutation, useGetSignedUrlQuery } = fileUploadApiQ;
export { fileUploadApiQ }