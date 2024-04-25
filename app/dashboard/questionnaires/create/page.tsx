"use client"
import { useAddNewQuestionnaireMutation } from "@/app/redux/apis/questionnairesApiQ"
import { QuestionnaireStatus, QuestionnaireSubject } from "@/models/QuestionnaireEnum"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

import QuestionnaireMetaForm from "../_components/QuestionnaireMeta/QuestionnaireMeta"
import QuestionnaireSectionEditor from "../_components/QuestionnaireSectionEditor/QuestionnaireSectionEditor"
import { questionnaireValidator } from "../_components/validators"

export default function AddQuestionaire() {
    const form1 = useForm<Questionnaire>({
        resolver: zodResolver(questionnaireValidator),
        defaultValues: {
            name: "",
            description: "",
            status: QuestionnaireStatus.DRAFT,
            subject: QuestionnaireSubject.Patient,
            sections: [],
        },
    })
    const router = useRouter()

    const [createQuestionnaireQuery] = useAddNewQuestionnaireMutation()

    const onFormSubmit = async (value: Partial<Questionnaire>) => {
        try {
            await createQuestionnaireQuery(form1.getValues()).unwrap()
            toast("Questionnaire created sucessfully", { type: "success" })
            router.push("/dashboard/questionnaires")
        } catch (error) {
            toast("Failed to create a new questionnaire", { type: "error" })
        }
    }

    const onSectionCreate = (data: QuestionnaireSection) => {
        const oldValue = form1.getValues("sections")
        const exists = oldValue.find((val) => val.name === data.name)
        if (exists) return

        form1.setValue("sections", [...oldValue, data])
    }

    return (
        <section className="flex flex-wrap flex-col gap-4">
            <div className=" w-full">
                <QuestionnaireMetaForm
                    formHook={form1 as any}
                    onSubmit={onFormSubmit}></QuestionnaireMetaForm>
            </div>
            <div className="w-full">
                <QuestionnaireSectionEditor
                    onSectionCreate={onSectionCreate}
                    form={form1}></QuestionnaireSectionEditor>
            </div>
        </section>
    )
}
