import { QuestionnaireStatus, QuestionnaireSubject } from "@/models/QuestionnaireEnum"
import * as z from "zod"

export const questionnaireMetaValidator = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    title: z.string().min(1, { message: "Title is required" }),
    description: z
        .string()
        .min(1, { message: "Description is required" })
        .max(3000, "Description can contain a max of 3000 characters"),
    status: z.nativeEnum(QuestionnaireStatus, {
        required_error: "Status is required",
    }),
    subject: z.nativeEnum(QuestionnaireSubject, {
        required_error: "A subject is necessary.",
    }),
})
