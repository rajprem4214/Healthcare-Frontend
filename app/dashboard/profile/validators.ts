import * as z from 'zod';

export const profileFormSchema = z.object({
    fullName: z
        .string()
        .min(2, {
            message: "First Name must be at least 2 characters.",
        })
        .max(30, {
            message: "First Name must not be longer than 30 characters.",
        }), 
    healthId: z.string(),     
    email: z
        .string({
            required_error: "Please select an email to display.",
        })
        .email(),    
    phoneNumber: z.string().max(160).min(4),
})