export enum RewardEvents {
    KYC_VERIFICATION = "kyc_verification",
    WHATSAPP_VERIFICATION = "whatsapp_verification",
    WEIGHT_REDUCTION = "weight_reduction",
}
export enum Comparator {
    isEqual = "==",
    isGreater = ">",
    isLess = "<",
    isGreaterOrEqual = ">=",
    isLessorEqual = "<=",
}

export enum RewardStatus {
    Active = "active",
    Inactive = "inactive",
    Archived = "archived",
    Draft = "draft",
}

export interface Reward {
    id: string
    event: RewardEvents
    title: string
    description: string
    amount: number
    status: RewardStatus
    updatedAt: Date
    recurrenceCount: number
    createdAt: Date
    conditions: RewardCondition[]
    expiresAt: Date | null
    originResource: string
}

export interface RewardCondition {
    event: RewardEvents
    field: string
    comparator: Comparator
    value: string
    updatedAt: Date
    createdAt: Date
}
