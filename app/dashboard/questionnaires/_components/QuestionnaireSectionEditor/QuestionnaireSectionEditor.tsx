"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

import { DataTable } from "@/components/ui/datatable"
import { QuestionaireSectionItemType } from "@/models/QuestionnaireEnum"
import { ColumnDef } from "@tanstack/react-table"
import {
    BadgeIcon,
    BookOpenCheckIcon,
    ClipboardCheckIcon,
    Hash,
    InfinityIcon,
    PlusCircleIcon,
    PlusIcon,
    Trash,
} from "lucide-react"
import { useState } from "react"
import { UseFormReturn, useFieldArray } from "react-hook-form"
import QuestionnaireSectionCreator from "./QuestionnaireSectionCreator"
import QuestionnaireSectionItemCreator from "./QuestionnaireSectionItemCreator"

interface QuestionnaireSectionEditorProps {
    form: UseFormReturn<Questionnaire>
    onSectionCreate: (data: QuestionnaireSection) => void
}

export default function QuestionnaireSectionEditor(props: QuestionnaireSectionEditorProps) {
    const [addSectionOpen, setAddSectionOpenStatus] = useState(false)
    const fieldArray = useFieldArray({
        control: props.form.control,
        name: "sections",
    })

    const itemTable: ColumnDef<QuestionnaireSectionItem>[] = [
        {
            accessorKey: "name",
            header: () => <div className="flex gap-3 justify-center">Name</div>,
            cell: ({ row }) => row.getValue("name") ?? "",
        },
        {
            accessorKey: "type",
            header: () => (
                <div className="flex gap-3 justify-center">
                    {" "}
                    <Hash size={18} />
                    Type
                </div>
            ),
            cell: ({ row }) => row.getValue("type") ?? "",
        },
        {
            accessorKey: "defaultValue",
            header: () => (
                <div className="flex gap-3 justify-center">
                    <BadgeIcon size={18}></BadgeIcon>Default Value
                </div>
            ),
            cell: ({ row }) => {
                const type = row.getValue("type")
                if (type === QuestionaireSectionItemType.CHOICE) {
                    return (
                        <ul>
                            {((row.getValue("values") as Array<string>) ?? []).map((v) => {
                                return <li key={v}>{v}</li>
                            })}
                        </ul>
                    )
                }
                return row.getValue("defaultValue") ?? "-"
            },
        },
        {
            accessorKey: "maxLength",
            header: () => (
                <div className="flex gap-3 justify-center">
                    {" "}
                    <InfinityIcon size={18} />
                    Max Answer Length
                </div>
            ),
            cell: ({ row }) => row.getValue("maxLength") ?? "",
        },
        {
            accessorKey: "readOnly",
            header: () => (
                <div className="flex gap-3 justify-center">
                    <BookOpenCheckIcon size={18}></BookOpenCheckIcon>Read Only
                </div>
            ),
            cell: ({ row }) => (row.getValue("readOnly") ? "Yes" : "No"),
        },
        {
            accessorKey: "required",
            header: () => (
                <div className="flex gap-3 justify-center">
                    <ClipboardCheckIcon size={18}></ClipboardCheckIcon>Required
                </div>
            ),
            cell: ({ row }) => (row.getValue("required") ? "Yes" : "No"),
        },
    ]

    const onItemAdd = (sectionName: string, item: QuestionnaireSectionItem) => {
        const secList = props.form.getValues("sections")
        const sectionIdx = secList.findIndex((sec) => sec.name === sectionName)
        const section = secList.at(sectionIdx)

        if (sectionIdx !== -1 && section) {
            const existingItemIdx = section.items.findIndex((i) => item.name === i.name && item.type === i.type)
            if (existingItemIdx !== -1) {
                section.items = section.items.filter((_, idx) => existingItemIdx !== idx)
            }
            const newItems = [...section.items, item]

            fieldArray.update(sectionIdx, { ...section, items: newItems })

            return
        }
    }

    const onItemDelete = (sectionName: string, itemIdx: number) => {
        const sectionIdx = fieldArray.fields.findIndex((sec) => sec.name === sectionName)
        if (sectionIdx !== -1) {
            const section = fieldArray.fields.at(sectionIdx)
            if (section) {
                const filterItems = section.items.filter((_, idx) => idx !== itemIdx)
                fieldArray.update(sectionIdx, { ...section, items: filterItems })
            }
        }
    }

    const onSectionCreateProxy = (sec: QuestionnaireSection) => {
        setAddSectionOpenStatus(false)
        props.onSectionCreate(sec)
    }

    return (
        <>
            <Card className="w-full ">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <h1 className="text-primary text-xl">Sections</h1>
                        <div>
                            <Dialog
                                open={addSectionOpen}
                                onOpenChange={setAddSectionOpenStatus}>
                                <DialogTrigger asChild>
                                    <Button type="button">
                                        <PlusCircleIcon className="mr-2 w-5"></PlusCircleIcon>Create Section
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="px-2">
                                    <QuestionnaireSectionCreator
                                        onCreate={onSectionCreateProxy}></QuestionnaireSectionCreator>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                    <hr className="  my-2 border-t" />
                </CardHeader>
                <CardContent className="flex flex-col gap-10 px-16">
                    {fieldArray.fields.map((f) => (
                        <div key={f.id}>
                            <div className="flex items-center justify-between">
                                <h1 className="text-primary text-lg">{f.name}</h1>
                                <div>
                                    {" "}
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="secondary">
                                                <PlusIcon className="w-4 mr-2"></PlusIcon> Add Item
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <QuestionnaireSectionItemCreator
                                                onItemCreate={onItemAdd}
                                                sectionName={f.name}></QuestionnaireSectionItemCreator>
                                        </DialogContent>
                                    </Dialog>
                                    <Button
                                        variant="destructive"
                                        className="ml-5">
                                        <Trash className="w-4 mr-2"></Trash> Delete
                                    </Button>
                                </div>
                            </div>
                            <DataTable
                                columns={itemTable}
                                data={f.items}
                                className="border mt-2 text-center rounded-md bg-white shadow-md"></DataTable>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </>
    )
}
