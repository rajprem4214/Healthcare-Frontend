import { Comparator, RewardEvents } from "@/models/reward"
import * as z from "zod"

export const addConditionValidator = z.object({
    field: z.string({ required_error: "Field Name is required" }).min(1, "Field Name cannot be empty"),
    value: z.string({ required_error: "Value is required" }).min(1, "Value cannot be empty"),
    comparator: z.nativeEnum(Comparator),
    id: z.string().optional(),
    event: z.nativeEnum(RewardEvents).optional(),
})
