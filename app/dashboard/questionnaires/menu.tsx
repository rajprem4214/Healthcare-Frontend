"use client"
import { Button } from "@/components/ui/button"
import { FilePlus } from "lucide-react"
import Link from "next/link"

export default function QuestionareMenu() {
    return (
        <menu className="w-full py-2 px-3 border rounded-md flex gap-2 items-center bg-white">
            <h1 className="text-xl text-primary font-semibold">Questionnaires</h1>
            <Link
                href={"/dashboard/questionnaires/create"}
                className="ml-auto ">
                <Button className="ml-auto flex gap-2">
                    <FilePlus size={18} /> Create
                </Button>
            </Link>
        </menu>
    )
}
