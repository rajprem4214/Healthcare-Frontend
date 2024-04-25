import { Metadata } from "next"
import QuestionareMenu from "./menu"

export const metadata: Metadata = {
    title: "Questionnaires - Inuwell Admin Dashboard",
    description: "The questionaire for form creation",
}
export default function QuestionareLayout({ children }: { children: React.ReactNode }) {
    return (
        <section>
            <QuestionareMenu />
            {children}
        </section>
    )
}
