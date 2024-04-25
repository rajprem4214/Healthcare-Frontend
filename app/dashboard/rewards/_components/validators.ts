import { Comparator, RewardEvents, RewardStatus } from "@/models/reward"
import * as z from "zod"

export const addConditionValidator = z.object({
    field: z.string({ required_error: "Field Name is required" }).min(1, "Field Name cannot be empty"),
    value: z.string({ required_error: "Value is required" }).min(1, "Value cannot be empty"),
    comparator: z.nativeEnum(Comparator),
})

export const rewardDetailsValidator = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z
        .string()
        .min(1, { message: "Description is required" })
        .max(3000, "Description can contain a max of 3000 characters"),
    status: z.nativeEnum(RewardStatus, { required_error: "Status is required" }),
    amount: z
        .number({ coerce: true })
        .int({ message: "Reward must be whole number" })
        .min(1, { message: "Reward must have a minimum value of 1" }),
    event: z.nativeEnum(RewardEvents, { required_error: "Event is required" }),
    originResource: z.string().min(1, { message: "Medplum Origin Resource cannot be empty" }),
    recurrenceCount: z.number({ coerce: true }).int({ message: "Recurrence count must be an integer" }).min(-1),
    conditions: z.array(addConditionValidator).min(0),
})
