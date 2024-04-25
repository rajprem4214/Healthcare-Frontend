"use client"
import { useGetProfileQuery } from "@/app/redux/apis/authApiQ"
import {
    useGetNotificationQuery,
    useSendCustomEmailMutation,
    useSendWhatsappMessageMutation,
    useUpdateNotificationMutation,
} from "@/app/redux/apis/notificationsApiQ"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Loader from "@/components/ui/loader"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { zodResolver } from "@hookform/resolvers/zod"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import { ReloadIcon } from "@radix-ui/react-icons"
import { Calendar as CalendarIcon, InfoIcon, RotateCcw } from "lucide-react"
import dynamic from "next/dynamic"
import { useParams } from "next/navigation"
import React, { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"
import { notificationFormValidator } from "../../new/validators"

export default function EditNotification() {
    const DynamicTextEditor = useMemo(() => {
        return dynamic(() => import("../../_components/textEditor"), {
            loading: () => <RotateCcw className="mr-2 h-4 w-4 animate-spin" />,
            ssr: false,
        })
    }, [])
    const params = useParams()

    type Checked = DropdownMenuCheckboxItemProps["checked"]

    const [updateNotification, updateNotificationStatus] = useUpdateNotificationMutation()
    const [sendCustomEmail, sendCustomEmailStatus] = useSendCustomEmailMutation()
    const [sendWhatsappMesssage, sendWhatsappMessageStatus] = useSendWhatsappMessageMutation()
    const getNotification = useGetNotificationQuery({ id: String(params?.id) })
    const [editorContent, setEditorContent] = useState<string>('');
    const [selectedDate, setSelectedDate] = React.useState<Date>()
    const [timeValue, setTimeValue] = React.useState<string>("00:00")
    const [emailMedium, setEmailMedium] = useState<Checked>(true)
    const [whatsappMedium, setWhatsappMedium] = useState<Checked>(false)
    const [inAppMedium, setInAppMedium] = useState<Checked>(false)

    const form = useForm<z.infer<typeof notificationFormValidator>>({
        resolver: zodResolver(notificationFormValidator),
        defaultValues: {
            // tags: "custom",
            notificationSaved: false,
            // status: "active",
            name: "",
            subject: "",
        },
    })

    const profile = useGetProfileQuery()
    let selectedMediums: Array<string> = []

    if (emailMedium) selectedMediums.push("email")
    if (whatsappMedium) selectedMediums.push("whatsapp")
    if (inAppMedium) selectedMediums.push("in-app")

    const onFormSubmit = async (value: z.infer<typeof notificationFormValidator>) => {
        const dirtyData: Partial<Record<string, unknown>> = {}
        const fields = form.formState.dirtyFields

        // Get all the dirty fields and store them in object
        Object.entries(fields).forEach((entry) => {
            const key = entry[0] as keyof z.infer<typeof notificationFormValidator>
            const isDirty = entry[1]

            if (isDirty) {
                dirtyData[key] = value[key]
            }
        })

        // Update the conditions to contain only the newly added ones
        if (Array.isArray(dirtyData.tags)) {
            const modifiedTags = value.tags
            dirtyData.tags = modifiedTags
        }

        dirtyData.id = getNotification?.data?.data?.id
        const notificationId = getNotification?.data?.data?.id as string

        const oldMediums: NotificationMedium = getNotification?.data?.data?.medium || ['email']
        const dirtyMediums = selectedMediums.filter((med) => {
            return !oldMediums.includes(med as NotificationMedium[0])
        })
        console.log(dirtyMediums)

        try {
            const triggerAt = selectedDate ? selectedDate.toString() : null
            let hasFailed = false
            const name = value.name
            const tags = value.tags
            const subject = value.subject
            const status = value.status
            const message = editorContent
            const medium = selectedMediums as NotificationMedium
            updateNotification({ notificationId, name, tags, subject, status, medium, message, triggerAt }).unwrap()
                if (updateNotificationStatus.isError) {
                    hasFailed = true
                }
            if (!hasFailed) {
                toast.info("Notification updated Successfully.")
                form.setValue("notificationSaved", true);
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleSendTestEmail = async () => {
        try {
            const name = form.getValues("name")
            const email = profile.data?.user?.email as string
            const subject = form.getValues("subject")
            const message = editorContent
            toast.promise(sendCustomEmail({ name, email, subject, message }).unwrap(), {
                success: "Email Sent Successfully.",
                pending: "Sending Email...",
                error: "Unable to send email. Please try again.",
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handleSendWhatsappMessage = async () => {
        try {
            const phone = profile.data?.user?.phoneNumber as string
            const message = editorContent
            toast.promise(sendWhatsappMesssage({ phone, message }).unwrap(), {
                success: "Whatsapp Notification Sent Successfully.",
                pending: "Sending Whatsapp Notification...",
                error: "Unable to send whatsapp notification. Please try again.",
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handleTimeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const time = e.target.value
        if (!selectedDate) {
            setTimeValue(time)
            return
        }
        const [hours, minutes] = time.split(":").map((str) => parseInt(str, 10))
        const newSelectedDate = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            hours,
            minutes
        )
        setSelectedDate(newSelectedDate)
        setTimeValue(time)
    }

    const handleDaySelect = (date: Date | undefined) => {
        if (!timeValue || !date) {
            setSelectedDate(date)
            return
        }
        const [hours, minutes] = timeValue.split(":").map((str) => parseInt(str, 10))
        const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes)
        setSelectedDate(newDate)
    }

    const handleReset = () => {
        form.reset({
            name: "",
            subject: "",
        })
        setSelectedDate(undefined)
        setTimeValue("00:00")
        setWhatsappMedium(false)
        setInAppMedium(false)
    }

    const updateSelectedMediums = () => {
        const oldMediums: NotificationMedium = getNotification?.data?.data?.medium || ['email']
        selectedMediums = [];
        if (oldMediums.includes('email')) {
            setEmailMedium(true);
            selectedMediums.push("email")
        }
        if (oldMediums.includes('whatsapp')) {
            setWhatsappMedium(!whatsappMedium);
            selectedMediums.push("whatsapp")
        }
        if (oldMediums.includes('in-app')) {
            setInAppMedium(!inAppMedium);
            selectedMediums.push("in-app")
        }
    };

    useEffect(() => {
        if (getNotification.isSuccess) {
            const data: any = getNotification.data?.data
            console.log("Data is", data)

            form.reset({
                ...data,
                notificationSaved: false,
            })
            updateSelectedMediums();
            setEditorContent(getNotification.data?.data?.message)

            setSelectedDate(() => {
                if (data.triggerAt) {
                    return new Date(data.triggerAt)
                }
            })
        }
    }, [getNotification.isSuccess])

    return (
        <section className="shadow-sm border rounded-md bg-white p-4 overflow-auto">
            <h1 className="text-primary text-xl">Edit Notification</h1>
            <hr className="mr-4  my-2 border-t" />
            {getNotification.isLoading ? (
                <div className="flex items-center justify-center w-full">
                    {" "}
                    <Loader></Loader>
                </div>
            ) : (
                <Tabs
                    defaultValue="editor"
                    className="w-[auto] mt-3">
                    <TabsList>
                        <TabsTrigger value="editor">Editor</TabsTrigger>
                        <TabsTrigger value="test">Test</TabsTrigger>
                    </TabsList>
                    <TabsContent value="editor">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onFormSubmit)}>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Notification Name</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter Notification name"
                                                            {...field}
                                                        />
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
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            defaultValue={getNotification.data?.data?.tags}>
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
                                                        <Input
                                                            placeholder="Enter subject"
                                                            {...field}
                                                        />
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
                                                        <Button variant={"outline"}>
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {selectedDate ? (
                                                                selectedDate.toLocaleString()
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <p className="text-center">
                                                            <input
                                                                type="time"
                                                                value={timeValue}
                                                                onChange={handleTimeChange}
                                                            />
                                                            Time
                                                        </p>
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
                                                        <Button variant="outline" className="capitalize">
                                                            {selectedMediums.length > 0
                                                                ? `Notify Me on: ${selectedMediums.join(", ")}`
                                                                : "Select a Medium"}
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="w-56">
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuCheckboxItem
                                                            checked={emailMedium}
                                                            onCheckedChange={setEmailMedium}>
                                                            Email
                                                        </DropdownMenuCheckboxItem>
                                                        <DropdownMenuCheckboxItem
                                                            checked={whatsappMedium}
                                                            onCheckedChange={setWhatsappMedium}>
                                                            Whatsapp
                                                        </DropdownMenuCheckboxItem>
                                                        <DropdownMenuCheckboxItem
                                                            checked={inAppMedium}
                                                            onCheckedChange={setInAppMedium}>
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
                                                                defaultValue={getNotification.data?.data?.status}>
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

                                <div className="mt-3">
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
                                    <Button
                                        type="submit"
                                        disabled={updateNotificationStatus.isLoading || selectedMediums.length === 0}>
                                        {!updateNotificationStatus.isLoading ? (
                                            "Save"
                                        ) : (
                                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </TabsContent>
                    <TabsContent value="test">
                        <Card className="p-3 mt-3">
                            <CardContent className="flex flex-col space-y-3">
                                <Label>Send To : </Label>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="terms"
                                        checked
                                    />
                                    <label
                                        htmlFor="terms"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        {profile.data?.user?.email}
                                    </label>
                                </div>
                                {profile.data?.user?.phoneNumber ? (
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="terms"
                                            checked
                                        />
                                        <label
                                            htmlFor="terms"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            {profile.data?.user?.phoneNumber}
                                        </label>
                                    </div>
                                ) : (
                                    <div className="flex items-center p-2  text-white text-xs ">
                                        <span className="flex items-center bg-gray-500 space-x-2 p-2 rounded-md">
                                            <InfoIcon size={18} />
                                            <label
                                                htmlFor="terms"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Try out WhatsApp notifications by adding up your phone number !
                                            </label>
                                        </span>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="flex space-x-2">
                                <Button
                                    type="button"
                                    disabled={
                                        (sendCustomEmailStatus.isLoading && updateNotificationStatus.isSuccess)
                                    }
                                    onClick={handleSendTestEmail}>
                                    {" "}
                                    {!sendCustomEmailStatus.isLoading ? (
                                        "Send Test Email"
                                    ) : (
                                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                    )}{" "}
                                </Button>
                                {profile.data?.user?.phoneNumber && (
                                    <Button
                                        type="button"
                                        disabled={
                                            (updateNotificationStatus.isLoading &&
                                                updateNotificationStatus.isSuccess &&
                                                whatsappMedium)
                                        }
                                        onClick={handleSendWhatsappMessage}>
                                        {" "}
                                        {!sendWhatsappMessageStatus.isLoading ? (
                                            "Send Whatsapp Message"
                                        ) : (
                                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                        )}{" "}
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            )}
        </section>
    )
}