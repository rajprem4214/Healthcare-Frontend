"use client"

import { badgeVariants } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/datepicker"
import { Form, FormControl, FormField, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QuestionaireSectionItemType } from "@/models/QuestionnaireEnum"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { sectionItemValidator } from "../validators"

export interface QuestionnaireSectionItemCreatorProps {
    sectionName: string
    defaultItem?: QuestionnaireSectionItem
    onItemCreate: (sectionId: string, item: QuestionnaireSectionItem) => void
}
export default function QuestionnaireSectionItemCreator(props: QuestionnaireSectionItemCreatorProps) {
    const [choiceInput, setChoiceInput] = useState<string>("")

    const formHook = useForm<QuestionnaireSectionItem>({
        resolver: zodResolver(sectionItemValidator),
        defaultValues: {
            ...props.defaultItem,
            type: props.defaultItem?.type ?? QuestionaireSectionItemType.STRING,
        },
    })
    const valueHook = useFieldArray<QuestionnaireSectionItem>({
        control: formHook.control,
        name: "values",
    })

    const typeWatch = formHook.watch("type")

    const onAddChoice = (choice: string) => {
        if (choice.length > 0) {
            valueHook.append(choice)
            setChoiceInput("")
        }
    }

    useEffect(() => {
        // Reset the typewatch
        if (typeWatch !== QuestionaireSectionItemType.CHOICE) {
            formHook.setValue("values", [])
        }
    }, [typeWatch])

    const itemCreateHandler = (item: QuestionnaireSectionItem) => {
        props.onItemCreate(props.sectionName, item)
    }
    return (
        <div className="bg-white">
            <div>
                <h1 className="text-primary text-xl">Add Item</h1>
                <hr className="  my-2 border-t" />
            </div>
            <Form {...formHook}>
                <form
                    className="grid grid-cols-2 gap-5"
                    onSubmit={formHook.handleSubmit(itemCreateHandler)}>
                    <div>
                        <FormField
                            control={formHook.control}
                            name="name"
                            render={({ field }) => {
                                return (
                                    <>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="The name of the section"
                                                {...field}></Input>
                                        </FormControl>
                                        <FormMessage className="text-center"></FormMessage>
                                    </>
                                )
                            }}
                        />
                    </div>
                    <div>
                        <FormField
                            name="type"
                            render={({ field }) => {
                                return (
                                    <div>
                                        <Label>Type</Label>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full capitalize">
                                                    <SelectValue placeholder=""></SelectValue>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {Object.values(QuestionaireSectionItemType).map((type) => {
                                                        return (
                                                            <SelectItem
                                                                className="capitalize"
                                                                value={type}
                                                                key={type}>
                                                                {type}
                                                            </SelectItem>
                                                        )
                                                    })}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )
                            }}></FormField>
                    </div>
                    {![QuestionaireSectionItemType.DATE, QuestionaireSectionItemType.CHOICE].includes(typeWatch) && (
                        <div className="col-span-full">
                            <FormField
                                control={formHook.control}
                                name="defaultValue"
                                render={({ field }) => {
                                    return (
                                        <>
                                            <FormLabel>Default Value</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="The default value for the section"
                                                    {...field}></Input>
                                            </FormControl>
                                            <FormMessage className="text-center"></FormMessage>
                                        </>
                                    )
                                }}
                            />
                        </div>
                    )}
                    {typeWatch === QuestionaireSectionItemType.CHOICE && (
                        <div className="col-span-full">
                            <FormField
                                control={formHook.control}
                                name="defaultValue"
                                render={({ field }) => {
                                    return (
                                        <>
                                            <div>
                                                <FormLabel>Choices</FormLabel>
                                                <div className="flex items-center gap-5">
                                                    <Input
                                                        placeholder="One of the possible choice"
                                                        onChange={(e) => {
                                                            setChoiceInput(e.target.value)
                                                        }}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") {
                                                                onAddChoice(choiceInput)
                                                            }
                                                        }}
                                                        value={choiceInput}></Input>
                                                    <Button
                                                        type="button"
                                                        className="rounded-full !p-2 w-8 h-8"
                                                        onClick={() => {
                                                            onAddChoice(choiceInput)
                                                        }}>
                                                        <PlusIcon className="w-4"></PlusIcon>
                                                    </Button>
                                                </div>
                                                <FormMessage className="text-center">
                                                    {formHook.formState.errors.values?.message}
                                                </FormMessage>
                                                <div className="flex flex-wrap items-center gap-2 my-2">
                                                    {formHook.getValues("values")?.map((val, idx) => (
                                                        <article
                                                            key={val}
                                                            className={`${badgeVariants({
                                                                variant: "default",
                                                            })} flex items-center justify-between gap-2 `}>
                                                            <p>{val}</p>
                                                            <X
                                                                className="w-4 h-4 hover:stroke-white cursor-pointer"
                                                                onClick={() => {
                                                                    valueHook.remove(idx)
                                                                }}
                                                            />
                                                        </article>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )
                                }}
                            />
                        </div>
                    )}
                    {typeWatch === QuestionaireSectionItemType.DATE && (
                        <div>
                            <FormField
                                control={formHook.control}
                                name="defaultValue"
                                render={() => {
                                    return (
                                        <>
                                            <FormLabel>Default Value</FormLabel>
                                            <FormControl>
                                                <DatePicker
                                                    onDateChange={(d) => {
                                                        formHook.setValue("defaultValue", d.toISOString())
                                                    }}></DatePicker>
                                            </FormControl>
                                            <FormMessage className="text-center"></FormMessage>
                                        </>
                                    )
                                }}
                            />
                        </div>
                    )}
                    <div>
                        <FormField
                            control={formHook.control}
                            name="maxLength"
                            render={({ field }) => {
                                return (
                                    <>
                                        <FormLabel>Maximum Length</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Length of the value given by user"
                                                type="number"
                                                {...field}></Input>
                                        </FormControl>
                                        <FormMessage className="text-center"></FormMessage>
                                    </>
                                )
                            }}
                        />
                    </div>
                    <div>
                        <FormField
                            name="required"
                            control={formHook.control}
                            render={({ field }) => {
                                return (
                                    <div>
                                        <FormLabel>Required</FormLabel>
                                        <Select
                                            onValueChange={(value) => {
                                                field.onChange(value === "true")
                                            }}>
                                            <FormControl>
                                                <SelectTrigger className="w-full capitalize">
                                                    <SelectValue placeholder=""></SelectValue>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value={"true"}>Yes</SelectItem>
                                                    <SelectItem value={"false"}>No</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )
                            }}></FormField>
                    </div>
                    <div>
                        <FormField
                            name="readOnly"
                            control={formHook.control}
                            render={({ field }) => {
                                return (
                                    <div>
                                        <FormLabel>Is Read Only</FormLabel>
                                        <Select
                                            onValueChange={(value) => {
                                                field.onChange(value === "true")
                                            }}>
                                            <FormControl>
                                                <SelectTrigger className="w-full capitalize">
                                                    <SelectValue placeholder=""></SelectValue>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value={"true"}>Yes</SelectItem>
                                                    <SelectItem value={"false"}>No</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )
                            }}></FormField>
                    </div>
                    <div className="col-span-full flex justify-end">
                        <Button
                            className="w-fit flex items-center justify-evenly"
                            type="submit">
                            Add
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
