import * as z from 'zod';

export const notificationFormValidator = z.object({
    name: z
        .string()
        .min(2, {
            message: "Name must be at least 2 characters.",
        })
        .max(30, {
            message: "Name must not be longer than 20 characters.",
        }),
    tags: z
        .string({
            required_error: "Please select a tag.",
        }),
    status: z.string({
        required_error: "Please select status.",
    }),
    subject: z.string({
        required_error: "Please enter subject.",
    }).max(160).min(4),
    notificationSaved: z.boolean()
})