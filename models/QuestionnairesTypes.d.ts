declare type Questionnaire = {
    id?: string
    name: string
    title: string
    description: string
    subject: QuestionnaireSubject
    status: QuestionnaireStatus
    effectivePeriod?: {
        start: Date
        end: Date
    }
    lastUpdated?: Date | string
    sections: Array<QuestionnaireSection>
}

declare interface QuestionnaireSection {
    name: string
    items: Array<QuestionnaireSectionItem>
}
declare interface QuestionnaireSectionItem {
    name: string
    type: CustomQuestionaireSectionItemType
    defaultValue?: string
    required?: boolean
    readOnly?: boolean
    maxLength?: number
    values?: Array<string>
}
