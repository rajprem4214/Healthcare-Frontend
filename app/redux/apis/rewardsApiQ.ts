import { Reward, RewardCondition } from "@/models/reward"
import { createApi } from "@reduxjs/toolkit/query/react"
import { RewardListResponse } from "../types/RewardTypes"
import { fetchBaseQuery } from "../utils"

const rewardsApiQ = createApi({
    reducerPath: "RewardsApiQ",
    baseQuery: fetchBaseQuery(),
    endpoints: (builder) => ({
        getRewardsList: builder.query<
            RewardListResponse,
            {
                sort: any
                page: number
                limit: number
            }
        >({
            query: ({ sort, page, limit }) => {
                const searchQueryParams = new URLSearchParams({
                    page: page.toString(),
                    limit: limit.toString(),
                })
                if (sort) {
                    searchQueryParams.append("sort", sort)
                }
                return "/reward?" + searchQueryParams.toString()
            },
            transformResponse: (data: ApiResponse<any>) => {
                return data?.data
            },
        }),
        createReward: builder.mutation<string, Partial<Reward>>({
            query(data) {
                const sendData = { ...data, id: undefined, createdAt: undefined, updatedAt: undefined }
                return {
                    body: sendData,
                    url: "/reward",
                    method: "POST",
                }
            },
            transformResponse(data: ApiResponse<any>) {
                // Return the id
                return data.id
            },
        }),
        updateReward: builder.mutation<string, Partial<Reward>>({
            query(data) {
                const sendData = { ...data, createdAt: undefined, updatedAt: undefined }

                if (!data.id) {
                    throw new Error("Id is not valid")
                }
                return {
                    body: sendData,
                    url: "/reward/" + data.id,
                    method: "PATCH",
                }
            },
            transformResponse(data: ApiResponse<any>) {
                // Return the id
                return data.id
            },
        }),
        getReward: builder.query<Reward, { id: string }>({
            query(data) {
                const id = data.id
                return {
                    url: "/reward/" + id,
                }
            },
            transformResponse(data: ApiResponse<Reward>) {
                const reward = {
                    ...data.data,
                }

                return reward
            },
        }),
        deleteRewardCondition: builder.mutation<{}, Partial<RewardCondition>>({
            query(data) {
                const searchParams = new URLSearchParams({
                    event: String(data.event),
                    comparator: String(data.comparator),
                    field: String(data.field),
                    value: String(data.value),
                })
                return {
                    url: "/reward/condition" + searchParams.toString(),
                    method: "DELETE",
                }
            },
        }),
    }),
})

export { rewardsApiQ }

export const {
    useCreateRewardMutation,
    useGetRewardsListQuery,
    useGetRewardQuery,
    useDeleteRewardConditionMutation,
    useUpdateRewardMutation,
} = rewardsApiQ
