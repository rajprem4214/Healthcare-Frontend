import { Reward } from "@/models/reward"

declare type RewardListResponse = {
    count: number
    limit: number
    page: number
    data: Reward[]
}
