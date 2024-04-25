import { createApi } from '@reduxjs/toolkit/query/react';
import { fetchBaseQuery } from '../utils';

const notificationsApiQ = createApi({
    reducerPath: 'NotificationsApiQ',
    baseQuery: fetchBaseQuery(),
    tagTypes: ['Notifications'],
    endpoints: (builder) => ({
        getNotificationsList: builder.query<
            NotificationsListResponse,
            {
                page: number;
                limit: number;
            }
        >({
            query: (params) => ({
                url: '/notifications',
                params,
            }),
            providesTags: () => [{ type: 'Notifications', id: 'LIST' }],
            transformResponse: (data: ApiResponse<NotificationsListResponse>) => {
                return data?.data
            },
        }),
        getNotification: builder.query<
            UserNotification,
            {
                id: string
            }
        >({
            query: (params) => ({
                url: "/notifications/" + params.id,
            }),
            providesTags: () => [{ type: "Notifications", id: "SINGLE" }],
            transformResponse: (data: ApiResponse<UserNotification>) => {
                return data.data
            },
        }),
        createNotification: builder.mutation({
            query: ({ name, tags, subject, medium, status, message, triggerAt }: {
                name: string,
                tags: string,
                subject: string,
                medium: NotificationMedium,
                status: string,
                message: string,
                triggerAt: string | null,
            }) => ({
                url: '/notifications/create',
                method: 'POST',
                body: {
                    name,
                    tags,
                    subject,
                    medium,
                    status,
                    message,
                    triggerAt,
                }
            }),
        }),
        // updateNotification: builder.mutation({
        //     query: (params) => ({
        //         url: "/notifications/" + params.id,
        //         method: "PATCH",
        //         body: {},
        //     }),
        //     transformResponse: (data: ApiResponse<{ message: string }>) => {
        //         return data.data
        //     },
        // }),
        updateNotification : builder.mutation({
            query: ({ notificationId, name, tags, subject, medium, status, message, triggerAt }: {
                notificationId: string,
                name?: string,
                tags?: string,
                subject?: string,
                medium?: NotificationMedium,
                status?: string,
                message?: string,
                triggerAt?: string | null,
            }) => ({
                url: `/notifications/${notificationId}`,
                method: 'PATCH',
                body: {
                    name,
                    tags,
                    subject,
                    medium,
                    status,
                    message,
                    triggerAt,
                }
            }),
        }),
        sendCustomEmail: builder.mutation({
            query: ({ name, email, subject, message }: {
                name: string,
                email: string,
                subject: string,
                message: string,
            }) => ({
                url: 'notifications/sendCustom',
                method: 'POST',
                body: {
                    name,
                    email,
                    subject,
                    message,
                },
            }),
        }),
        sendWhatsappMessage: builder.mutation({
            query: ({ phone, message }: {
                phone: string,
                message: string,
            }) => {
                return {
                    url: '/notifications/waMsg',
                    method: 'POST',
                    body: JSON.stringify({
                        phone,
                        message,
                    }),
                };
            },
        }),
    }),
});

export { notificationsApiQ };

export const { useGetNotificationsListQuery, useGetNotificationQuery, useCreateNotificationMutation, useUpdateNotificationMutation, useSendCustomEmailMutation, useSendWhatsappMessageMutation } = notificationsApiQ
