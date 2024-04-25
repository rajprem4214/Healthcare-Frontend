export enum QuestionnaireStatus {
    ACTIVE = "active",
    DRAFT = "draft",
    RETIRED = "retired",
}

export enum QuestionaireSectionItemType {
    STRING = "string",
    CHOICE = "choice",
    INTEGER = "integer",
    DECIMAL = "decimal",
    DATE = "date",
}

export enum QuestionnaireSubject {
    Patient = "Patient",
    Practitioner = "Practitioner",
    Appointment = "Appointment",
}
