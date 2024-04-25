import { Reward } from "@/models/reward"
import { proxy } from "valtio"

export type ActionType = "ADD" | "UPDATE"

export interface RewardModifyStore {
    reward: Partial<Reward>
    isLoading: boolean
    isSubmitted: boolean
    type: ActionType
    actions: {
        reset: () => void
    }
}

const defaultRewardModifyStore: RewardModifyStore = {
    reward: {
        amount: 0,
        conditions: [],
        recurrenceCount: 1,
    },
    isLoading: false,
    isSubmitted: false,
    type: "ADD" as ActionType,
    actions: {
        reset() {
            rewardModifyStore.reward = { ...defaultRewardModifyStore.reward }
            rewardModifyStore.isLoading = defaultRewardModifyStore.isLoading
            rewardModifyStore.isSubmitted = defaultRewardModifyStore.isSubmitted
            rewardModifyStore.type = defaultRewardModifyStore.type
        },
    },
}

const rewardModifyStore = proxy({ ...defaultRewardModifyStore })

export function getRewardModifyStore() {
    return rewardModifyStore
}
