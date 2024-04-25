import rewardApi from "@/app/api/reward"
import { PaginationFilter } from "@/interface/pagination"
import { Reward, RewardEvents } from "@/models/reward"
import { Paging } from "@/utils/store"
import { proxy } from "valtio"

export interface RewardListStore extends Paging<Reward> {
    isLoading: boolean
    error: unknown | null
}

const defaultRewardListStore: RewardListStore = {
    data: [],
    pageNo: 1,
    count: 15,
    isLoading: false,
    error: null,
    maxPage: -1,
    actions: {
        async getPage(page: number) {
            // Ensure page count does not go below 0
            const newPage = Math.max(page, 1)

            if (rewardListStore.pageNo === newPage) {
                return
            }

            // Ensure no request is made if max page is reached
            if (rewardListStore.maxPage > -1 && newPage > rewardListStore.maxPage) {
                return
            }
            const oldPage = rewardListStore.data

            rewardListStore.data = []
            rewardListStore.isLoading = true

            try {
                const list = await getPage(newPage, rewardListStore.count)

                // If no rows are returned it is possible that the end of row is returned so restore the previous cached page.
                if (list.length === 0) {
                    rewardListStore.maxPage = newPage - 1
                    rewardListStore.isLoading = false
                    rewardListStore.data = oldPage

                    return
                }

                // Update the page data
                rewardListStore.data = [...list]
                rewardListStore.pageNo = newPage
                rewardListStore.error = null
            } catch (error: unknown) {
                // Restore old page on error
                rewardListStore.data = [...oldPage]
                rewardListStore.error = error
            } finally {
                rewardListStore.isLoading = false
            }
        },

        async refresh(force?: boolean) {
            // Do not refresh if any other action is still performing data changes.
            if (!force && rewardListStore.isLoading) {
                return
            }
            rewardListStore.data = []
            rewardListStore.isLoading = true

            try {
                const list = await getPage(rewardListStore.pageNo, rewardListStore.count)

                rewardListStore.data = list
                rewardListStore.error = null
            } catch (error: unknown) {
                rewardListStore.error = error
            } finally {
                rewardListStore.isLoading = false
            }
        },

        reset() {
            rewardListStore.count = defaultRewardListStore.count
            rewardListStore.data = defaultRewardListStore.data
            rewardListStore.pageNo = defaultRewardListStore.pageNo
            rewardListStore.maxPage = defaultRewardListStore.maxPage
            rewardListStore.isLoading = defaultRewardListStore.isLoading
            rewardListStore.error = defaultRewardListStore.error
        },
    },
}

const rewardListStore = proxy({ ...defaultRewardListStore })

export function getRewardListStore() {
    return rewardListStore
}

// Private methods
async function getPage(page: number, count: number, filter: Partial<PaginationFilter> = {}) {
    const list = await rewardApi.getRewardList(page, count, {
        ...filter,
    })

    return list.map((val) => {
        return {
            amount: Number(val.amount),
            conditions: Array.isArray(val.conditions) ? val.conditions : [],
            createdAt: val.createdAt ? new Date(val.createdAt) : "",
            description: val.description ?? "",
            title: val.title ?? "",
            event: val.event as RewardEvents,
            expiresAt: val.expiresAt ? val.expiresAt : null,
            id: val.id,
            recurrenceCount: parseInt(String(val.recurrenceCount ?? "0")),
            status: val.status ?? "",
            updatedAt: val.updatedAt ? new Date(val.updatedAt) : "",
            originResource: val.originResource ?? "",
        } as Reward
    })
}
