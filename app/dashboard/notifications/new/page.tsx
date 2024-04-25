'use client';
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar } from "@/components/ui/calendar"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    FormControl,
    FormField,
    Form,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'
import { ReloadIcon } from "@radix-ui/react-icons"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { RotateCcw, ChevronDown, Calendar as CalendarIcon, InfoIcon } from 'lucide-react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import dynamic from "next/dynamic";
import { zodResolver } from '@hookform/resolvers/zod';
import { notificationFormValidator } from './validators';
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import { toast } from 'react-toastify';
import { useCreateNotificationMutation, useSendCustomEmailMutation, useSendWhatsappMessageMutation } from '@/app/redux/apis/notificationsApiQ';
import { useGetProfileQuery } from '@/app/redux/apis/authApiQ';

export default function AddNotification() {

    const DynamicTextEditor = useMemo(() => {
        return dynamic(() => import("../_components/textEditor"), {
            loading: () => <RotateCcw className="mr-2 h-4 w-4 animate-spin" />,
            ssr: false,
        });
    }, []);

    type Checked = DropdownMenuCheckboxItemProps["checked"]

    const [createNotification, createNotificationStatus] = useCreateNotificationMutation();
    const [sendCustomEmail, sendCustomEmailStatus] = useSendCustomEmailMutation();
    const [sendWhatsappMesssage, sendWhatsappMessageStatus] = useSendWhatsappMessageMutation();
    const [editorContent, setEditorContent] = useState<string>('');
    const [selectedDate, setSelectedDate] = React.useState<Date>();
    const [timeValue, setTimeValue] = React.useState<string>('00:00');
    const [emailMedium, setEmailMedium] = useState<Checked>(true)
    const [whatsappMedium, setWhatsappMedium] = useState<Checked>(false)
    const [inAppMedium, setInAppMedium] = useState<Checked>(false)

    const form = useForm<z.infer<typeof notificationFormValidator>>({
        resolver: zodResolver(notificationFormValidator),
        defaultValues: {
            tags: "custom",
            status: "active",
            notificationSaved: false,
        },
    })

    const profile = useGetProfileQuery();
    const selectedMediums: any = [];

    if (emailMedium) selectedMediums.push('email');
    if (whatsappMedium) selectedMediums.push('whatsapp');
    if (inAppMedium) selectedMediums.push('in-app');

    const onFormSubmit = async (value: z.infer<typeof notificationFormValidator>) => {
        try {
            const triggerAt = selectedDate ? selectedDate.toString() : null
            let hasFailed = false;
            const name = value.name
            const tags = value.tags
            const status = value.status
            const subject = value.subject
            const message = editorContent
            const medium: NotificationMedium = selectedMediums;
            createNotification({ name, tags, subject, medium, status, message, triggerAt }).unwrap();
                if (createNotificationStatus.isError) {
                    hasFailed = true;
                }
            if (!hasFailed) {
                toast.info('Notification Saved Successfully.')
            }

            form.setValue("notificationSaved", true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSendTestEmail = async () => {
        try {
            const name = form.getValues().name
            const email = profile.data?.user?.email as string
            const subject = form.getValues().subject
            const message = editorContent
            toast
                .promise(
                    sendCustomEmail({ name, email, subject, message }).unwrap(),
                    {
                        success: 'Email Sent Successfully.',
                        pending: 'Sending Email...',
                        error: 'Unable to send email. Please try again.',
                    }
                );
        } catch (error) {
            console.log(error)
        }
    };

    const handleSendWhatsappMessage = async () => {
        try {
            const phone = profile.data?.user?.phoneNumber as string
            const message = editorContent
            toast
                .promise(
                    sendWhatsappMesssage({ phone, message }).unwrap(),
                    {
                        success: 'Whatsapp Notification Sent Successfully.',
                        pending: 'Sending Whatsapp Notification...',
                        error: 'Unable to send whatsapp notification. Please try again.',
                    }
                );
        } catch (error) {
            console.log(error)
        }
    };

    const handleTimeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const time = e.target.value;
        if (!selectedDate) {
            setTimeValue(time);
            return;
        }
        const [hours, minutes] = time.split(':').map((str) => parseInt(str, 10));
        const newSelectedDate = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            hours,
            minutes
        );
        setSelectedDate(newSelectedDate);
        setTimeValue(time);
    };

    const handleDaySelect = (date: Date | undefined) => {
        if (!timeValue || !date) {
            setSelectedDate(date);
            return;
        }
        const [hours, minutes] = timeValue
            .split(':')
            .map((str) => parseInt(str, 10));
        const newDate = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            hours,
            minutes
        );
        setSelectedDate(newDate);
    };

    const handleReset = () => {
        form.reset({
            name: '',
            subject: '',
        });
        setSelectedDate(undefined);
        setTimeValue('00:00');
        setEditorContent('');
        setWhatsappMedium(false)
        setInAppMedium(false)
    }

    return (
        <section className="shadow-sm border rounded-md bg-white p-4 overflow-auto">
            <h1 className="text-primary text-xl">New Notification</h1>
            <hr className="mr-4  my-2 border-t" />
            <Tabs defaultValue="editor" className="w-[auto] mt-3">
                <TabsList>
                    <TabsTrigger value="editor">Editor</TabsTrigger>
                    <TabsTrigger value="test">Test</TabsTrigger>
                </TabsList>
                <TabsContent value="editor">
                    <Form  {...form} >
                        <form onSubmit={form.handleSubmit(onFormSubmit)} >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Notification Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter Notification name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="tags"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tags</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a tag" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="custom">Custom</SelectItem>
                                                            <SelectItem value="event">Event</SelectItem>
                                                            <SelectItem value="social">Social</SelectItem>
                                                            <SelectItem value="alert">Alert</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="subject"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Subject</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter subject" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div>
                                    <FormItem>
                                        <FormLabel>Date</FormLabel>
                                        <br />
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {selectedDate ? selectedDate.toLocaleString() : <span>Pick a date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <p className='text-center'><input
                                                        type="time"
                                                        value={timeValue}
                                                        onChange={handleTimeChange}
                                                    />Time</p>
                                                    <Calendar
                                                        mode="single"
                                                        selected={selectedDate}
                                                        onSelect={handleDaySelect}
                                                        className="rounded-md border"
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                    </FormItem>
                                </div>
                                <div>
                                    <FormItem>
                                        <FormLabel>Watching</FormLabel>
                                        <br />
                                        <FormControl>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" className='capitalize'>{selectedMediums.length > 0
                                                        ? `Notify Me on: ${selectedMediums.join(', ')}`
                                                        : 'Select a Medium'}</Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-56">
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuCheckboxItem
                                                        checked={emailMedium}
                                                        onCheckedChange={setEmailMedium}
                                                    >
                                                        Email
                                                    </DropdownMenuCheckboxItem>
                                                    <DropdownMenuCheckboxItem
                                                        checked={whatsappMedium}
                                                        onCheckedChange={setWhatsappMedium}

                                                    >
                                                        Whatsapp
                                                    </DropdownMenuCheckboxItem>
                                                    <DropdownMenuCheckboxItem
                                                        checked={inAppMedium}
                                                        onCheckedChange={setInAppMedium}
                                                    >
                                                        In-App
                                                    </DropdownMenuCheckboxItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </FormControl>
                                    </FormItem>
                                </div>
                                <div>
                                    <FormField
                                                control={form.control}
                                                name="status"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Status</FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                onValueChange={field.onChange}
                                                                defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select Status" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="active">Active</SelectItem>
                                                                    <SelectItem value="archive">Inactive</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                </div>
                            </div>

                            <div className='mt-3'>
                                <FormItem>
                                    <FormLabel>Notification Message</FormLabel>
                                    <FormControl>
                                        <div>
                                            <DynamicTextEditor value={editorContent} onChange={setEditorContent} />
                                        </div>
                                    </FormControl>
                                </FormItem>

                            </div>
                            <div className="mt-4 flex justify-end space-x-4">
                                <Button type="submit" disabled={createNotificationStatus.isLoading || selectedMediums.length === 0}>{!createNotificationStatus.isLoading ? 'Save' : <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}</Button>
                                <Button type="reset" onClick={handleReset}>Reset</Button>
                            </div>
                        </form>
                    </Form>
                </TabsContent>
                <TabsContent value="test">
                    <Card className='p-3 mt-3'>
                        <CardContent className="flex flex-col space-y-3">
                            <Label>Send To : </Label>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="terms" checked />
                                <label
                                    htmlFor="terms"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {profile.data?.user?.email}
                                </label>
                            </div>
                            {profile.data?.user?.phoneNumber ? (<div className="flex items-center space-x-2">
                                <Checkbox id="terms" checked />
                                <label
                                    htmlFor="terms"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {profile.data?.user?.phoneNumber}
                                </label>
                            </div>) : (<div className="flex items-center p-2  text-white text-xs ">
                                <span className='flex items-center bg-gray-500 space-x-2 p-2 rounded-md'>
                                    <InfoIcon size={18} />
                                    <label
                                        htmlFor="terms"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Try out WhatsApp notifications by adding up your phone number !
                                    </label>
                                </span>
                            </div>)}

                        </CardContent>
                        <CardFooter className="flex space-x-2">
                            <Button type="button" disabled={sendCustomEmailStatus.isLoading && createNotificationStatus.isSuccess || !form.getValues("notificationSaved")} onClick={handleSendTestEmail}> {!sendCustomEmailStatus.isLoading ? 'Send Test Email' : <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />} </Button>
                            {profile.data?.user?.phoneNumber && (<Button type="button" disabled={createNotificationStatus.isLoading && createNotificationStatus.isSuccess && whatsappMedium || !form.getValues("notificationSaved")} onClick={handleSendWhatsappMessage}> {!sendWhatsappMessageStatus.isLoading ? 'Send Whatsapp Message' : <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />} </Button>)}
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </section>
    );
}
