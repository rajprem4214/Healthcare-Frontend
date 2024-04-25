"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Form, FormControl, FormField, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RewardEvents, RewardStatus } from "@/models/reward"
import { getRewardModifyStore } from "@/store/reward/modify"
import { useState } from "react"
import { UseFormReturn } from "react-hook-form"
import { z } from "zod"
import { rewardDetailsValidator } from "./validators"

import { Checkbox } from "@/components/ui/checkbox"
import { Package2, PencilRulerIcon, ShieldCheck, ShieldClose } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export interface ModifyBaseRewardProps {
    formManager: UseFormReturn<z.infer<typeof rewardDetailsValidator>, any, undefined>
    onSubmit: (data: z.infer<typeof rewardDetailsValidator>) => void
}

export default function ModifyBaseReward(props: ModifyBaseRewardProps) {
    const formStore = getRewardModifyStore()

    const [isRecurrence, setRecurrence] = useState(false)

    const modifyStatus = (status: RewardStatus) => {
        props.formManager.setValue("status", status)
    }

    function onSubmit(values: z.infer<typeof rewardDetailsValidator>) {
        props.onSubmit(values)
    }

    const statusWatch = props.formManager.watch("status")

    return (
        <section className="w-full ">
            <div className="">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold">Enter Reward Details</h3>
                            <div className="flex items-center gap-5">
                                {formStore.type === "ADD" && (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    className="bg-violet-800 hover:bg-violet-700 rounded-full w-12 h-12 "
                                                    onClick={() => {
                                                        modifyStatus(RewardStatus.Draft)
                                                    }}>
                                                    <PencilRulerIcon></PencilRulerIcon>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-gray-500">
                                                <p>Mark as Draft</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                                {
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    className="bg-green-800 hover:bg-green-700 rounded-full w-12 h-12 p-3 "
                                                    onClick={() => {
                                                        modifyStatus(RewardStatus.Active)
                                                    }}>
                                                    <ShieldCheck></ShieldCheck>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-gray-500">
                                                <p>Mark as Active</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                }
                                {formStore.type === "UPDATE" &&
                                    [RewardStatus.Active].includes(props.formManager.getValues("status")) && (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        className="bg-red-800 hover:bg-red-700 rounded-full w-12 h-12 p-3 "
                                                        onClick={() => {
                                                            modifyStatus(RewardStatus.Inactive)
                                                        }}>
                                                        <ShieldClose></ShieldClose>
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-gray-500">
                                                    <p>Mark as Active</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )}

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            {formStore.type === "UPDATE" &&
                                                [RewardStatus.Active].includes(
                                                    props.formManager.getValues("status") as RewardStatus
                                                ) && (
                                                    <Button
                                                        className="bg-gray-800 hover:bg-gray-700 rounded-full w-12 h-12 "
                                                        onClick={() => {
                                                            modifyStatus(RewardStatus.Archived)
                                                        }}>
                                                        <Package2></Package2>
                                                    </Button>
                                                )}
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-gray-500">
                                            <p>Archive</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Form {...props.formManager}>
                            <form
                                className="grid gap-5"
                                onSubmit={props.formManager.handleSubmit(onSubmit)}>
                                <div>
                                    <FormField
                                        control={props.formManager.control}
                                        name="title"
                                        render={({ field }) => {
                                            return (
                                                <>
                                                    <FormLabel>Title</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Something like Reduce weight below 60 and get....."
                                                            {...field}></Input>
                                                    </FormControl>
                                                    <FormMessage className="text-center"></FormMessage>
                                                </>
                                            )
                                        }}></FormField>
                                </div>
                                <div>
                                    <FormField
                                        control={props.formManager.control}
                                        name="description"
                                        render={({ field }) => {
                                            return (
                                                <>
                                                    <FormLabel>Description</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Now what do I have to do in depth"
                                                            {...field}></Textarea>
                                                    </FormControl>
                                                    <FormMessage className="text-center"></FormMessage>
                                                </>
                                            )
                                        }}></FormField>
                                </div>

                                <div>
                                    <FormField
                                        control={props.formManager.control}
                                        name="amount"
                                        render={({ field }) => {
                                            return (
                                                <>
                                                    <FormLabel>Amount</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            {...field}></Input>
                                                    </FormControl>
                                                    <FormMessage className="text-center"></FormMessage>
                                                </>
                                            )
                                        }}></FormField>
                                </div>
                                {
                                    <div>
                                        <>
                                            <FormLabel>Status</FormLabel>
                                            <Badge className="ml-2 capitalize">{statusWatch}</Badge>

                                            <FormMessage className="text-center"></FormMessage>
                                        </>
                                    </div>
                                }

                                <div>
                                    <FormField
                                        control={props.formManager.control}
                                        name="event"
                                        render={({ field }) => {
                                            return (
                                                <>
                                                    <FormLabel>Event</FormLabel>

                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="w-full capitalize">
                                                                <SelectValue
                                                                    className="capitalize"
                                                                    placeholder=""></SelectValue>
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="">
                                                            <SelectGroup>
                                                                {Object.values(RewardEvents).map((status) => (
                                                                    <SelectItem
                                                                        key={status}
                                                                        value={status}
                                                                        className="capitalize">
                                                                        {status}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>

                                                    <FormMessage className="text-center"></FormMessage>
                                                </>
                                            )
                                        }}></FormField>
                                </div>
                                <div>
                                    <FormField
                                        control={props.formManager.control}
                                        name="originResource"
                                        render={({ field }) => {
                                            return (
                                                <>
                                                    <FormLabel>Medplum Resource Type</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Patient"
                                                            {...field}></Input>
                                                    </FormControl>
                                                    <FormMessage className="text-center"></FormMessage>
                                                </>
                                            )
                                        }}></FormField>
                                </div>
                                {!isRecurrence && (
                                    <>
                                        <div>
                                            <FormField
                                                control={props.formManager.control}
                                                name="recurrenceCount"
                                                render={({ field }) => {
                                                    return (
                                                        <>
                                                            <FormLabel>Maximum Reward Claim </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    {...field}></Input>
                                                            </FormControl>
                                                            <FormMessage className="text-center"></FormMessage>
                                                        </>
                                                    )
                                                }}></FormField>
                                        </div>
                                    </>
                                )}
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        checked={isRecurrence}
                                        onClick={() => {
                                            setRecurrence((prev) => !prev)
                                        }}></Checkbox>
                                    <p>Unlimited Reward Claims</p>
                                </div>
                                <div className="flex flex-row-reverse  mt-5">
                                    <Button
                                        className="w-fit bg-green-600"
                                        type="submit">
                                        {formStore.type === "UPDATE" ? "Update Reward" : "Create Reward"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}
