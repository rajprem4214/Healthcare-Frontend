import { QuestionaireSectionItemType, QuestionnaireStatus, QuestionnaireSubject } from "@/models/QuestionnaireEnum"
import { z } from "zod"
export const createSectionValidator = z.object({
    name: z.string().min(1, { message: "Name cannot be empty" }),
})

export const questionaireFormAddSectionValidator = z.object({
    name: z.string({ required_error: "Name is required" }).min(1, "Name cannot be empty"),
})

export const sectionItemValidator = z
    .object({
        name: z.string({ required_error: "Name is required" }).min(1, "Name cannot be empty"),
        type: z.nativeEnum(QuestionaireSectionItemType, {
            required_error: "Type is required",
        }),
        values: z.array(z.string()).optional(),
    })
    .superRefine((data, ctx) => {
        if (data.type === QuestionaireSectionItemType.CHOICE && data.values?.length === 0) {
            ctx.addIssue({
                message: "Atleast 1 choice is required",
                path: ["values"],
                code: "custom",
            })
        }
    })

export const sectionValidator = z.object({
    name: z.string().min(1, { message: "Section name is required" }),
    items: z.array(sectionItemValidator).min(0),
})

export const questionnaireValidator = z.object({
    id: z.string(),
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
    sections: z.array(sectionValidator),
})
