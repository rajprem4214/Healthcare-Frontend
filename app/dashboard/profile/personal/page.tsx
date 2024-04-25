"use client"
import { useGetProfileQuery, useLazyGetOtpQuery, useUpdateProfileMutation, useVerifyOtpMutation } from '@/app/redux/apis/authApiQ';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from '@/lib/utils';
import { Loader2Icon, Check, Ban } from 'lucide-react';
import { profileFormSchema } from '../validators';
import { useGetSignedUrlQuery, useUploadFilesMutation } from '@/app/redux/apis/uploadApiQ';
import { toast } from 'react-toastify';


export default function PersonalProfile() {

    const getProfile: any = useGetProfileQuery();
    const [uploadFiles, uploadFilesStatus] = useUploadFilesMutation();
    const [updateProfile, updateProfileStatus] = useUpdateProfileMutation();
    const [selectedFile, setSelectedFile] = useState<File>();
    const [email, setEmail] = useState<string>('');
    const [otp, setOtp] = useState<string>('');
    const [getOtp, getOtpStatus] = useLazyGetOtpQuery();
    const [verifyOtp, verifyOtpStatus] = useVerifyOtpMutation();
    // const [getSignedUrl, getSignedUrlStatus] = useGetSignedUrlQuery({ id: String(getProfile.data?.user?.profilePictureUrl) });

    useEffect(() => {
        if (getProfile.isSuccess) {
            const data: any = getProfile.data?.user
            console.log("Data is", data)

            form.reset({
                ...data,
            })

            // console.log(getSignedUrl?.data)

            setEmail(data?.email)
        }
    }, [getProfile.isSuccess])

    type ProfileFormValues = z.infer<typeof profileFormSchema>

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        mode: "onChange",
    })

    const handleImageChange = async (event: any) => {
        setSelectedFile(null as any);
        const file: File = event.target.files[0];
        setSelectedFile(file);
    };

    const handlePhotoUpload = async () => {
        const formData = new FormData();
        formData.append('file', selectedFile as File);
        formData.append('documentType', 'profileImage')
        try {
            const storedFileUrl = await toast
                .promise(
                    uploadFiles(formData).unwrap(),
                    {
                        success: 'Image Uploaded Successfully.',
                        pending: 'Uploading image...',
                        error: 'Unable to upload image. Please try again.',
                    }
                )
            const userId = getProfile.data?.user?.id;
            const profilePictureUrl = storedFileUrl?.data?.id;
            updateProfile({ userId, profilePictureUrl }).unwrap()
        } catch (error) {
            console.log(error)
        }
    }

    function onSubmit(data: ProfileFormValues) {
        const userId = getProfile.data?.user?.id;
        const fullName = data.fullName;
        const email = data.email;
        const phoneNumber = data.phoneNumber;

        toast.promise(updateProfile({ userId, fullName, email, phoneNumber }).unwrap(), {
            pending: 'Updating Profile...',
            success: 'Profile Updated.',
            error: "Couldn't update profile.",
        })

        console.log(data)
    }

    const emailValidator = z.string().email();
    const stringValidator = z.string();

    const onSendOtp = async () => {
        const email = form.getValues('email')
        const result = emailValidator.safeParse(email);
        if (!result.success) {
            toast.error('Please Enter Correct Email');
        } else {
            try {
                toast.promise(getOtp(email).unwrap(), {
                pending: 'Sending otp request',
                success: 'Otp request sent. Please check your email',
                error: "Couldn't send otp.",
            });
            } catch (error) {
                throw new Error('Error in Sending OTP')
            }
        }
    };

    function imageLoader () {
        return getProfile.data?.user?.profilePictureUrl;
    }

    const onVerifyOtp = async () => {
        const email = form.getValues('email')
        const result = emailValidator.safeParse(email);
        const result2 = stringValidator.safeParse(otp);
        const clearAuthTokens = false;

        if (!result.success || !result2.success) {
            toast.error('Please Enter Correct Email or OTP');
        } else {
            try {
                toast.promise(verifyOtp({ email, otp, clearAuthTokens }).unwrap(), {
                    pending: 'Verifying otp request',
                    success: 'Email Verified.',
                    error: "Error in verifying otp.",
                });
                const userId = getProfile.data?.user?.id;
                const emailVerified: number = 1;
                updateProfile({ userId, emailVerified }).unwrap()
            } catch (error) {
                throw new Error('Error in Verifying OTP')
            }   
        }
    };

    return (
        <section className="bg-white border rounded-md p-3">
            <div className='grid grid-cols-2'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="healthId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Health Id</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="N/A" disabled={true} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <div className='flex space-x-2'>
                                        <Input {...field} type="email" placeholder="Enter your email" disabled={true} />
                                        {getProfile.data?.user?.emailVerified === 1 ? (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant={'outline'} type='reset' >
                                                            <Check className='text-green-500' />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Verified</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>) : (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant={'outline'} type='reset' disabled>
                                                        <Ban className='text-red-500' />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px]">
                                                    <DialogHeader>
                                                        <DialogTitle>Verify Email</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label htmlFor="email" className="text-right">
                                                                Email
                                                            </Label>
                                                            <Input id="email" value={getProfile.data?.user?.email} className="col-span-3" disabled />
                                                        </div>
                                                        <div className="items-center gap-4">
                                                            {!getOtpStatus.isSuccess ? (<Button
                                                                className={cn('w-full', {
                                                                    'disabled:opacity-40': getOtpStatus.isLoading,
                                                                })}
                                                                onClick={onSendOtp}
                                                                disabled={getOtpStatus.isLoading}
                                                            >
                                                                {getOtpStatus.isLoading ? (
                                                                    <>
                                                                        <Loader2Icon className="animate-spin me-3" />
                                                                        Sending OTP...
                                                                    </>
                                                                ) : (
                                                                    'Send OTP'
                                                                )}
                                                            </Button>) : (
                                                                <div className='flex flex-col space-y-3'>
                                                                    <Input type='text' onChange={(e) => setOtp(e.target.value ?? '')} placeholder='Enter your OTP' />
                                                                    <Button variant={'default'} className={cn('w-full', {
                                                                        'disabled:opacity-40': verifyOtpStatus.isLoading,
                                                                    })} disabled={verifyOtpStatus.isLoading} type='reset' onClick={onVerifyOtp}>Verify</Button>
                                                                </div>
                                                            )
                                                            }
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        )
                                        }
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <Input {...field} type='text' placeholder='Enter your phone number' disabled={true} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className='mt-5'>Update profile</Button>
                    </form>
                </Form>
                <div className='flex flex-col items-center space-y-4'>
                    <Label className='font-semibold'>Profile Picture</Label>
                    <div className="flex flex-col items-center space-y-3">
                        {
                            getProfile.data?.user?.profilePictureUrl !== '' ? (
                                <Image
                                    className="w-40 h-40 rounded-full"
                                    src={getProfile.data?.user?.profilePictureUrl}
                                    loader={imageLoader}
                                    unoptimized={true}
                                    alt="user photo"
                                    width={40}
                                    height={40}
                                />
                            ) : (
                                <Image
                                    className="w-40 h-40 rounded-full"
                                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${`${getProfile.data?.user?.fullName}`}`}
                                    alt="user photo"
                                    width={40}
                                    height={40}
                                />
                            )}
                        <Input id="picture" type="file" onChange={handleImageChange} />
                        <Button onClick={handlePhotoUpload} disabled={uploadFilesStatus.isLoading}>
                            Upload Photo
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
