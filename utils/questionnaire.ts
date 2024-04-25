import { QuestionaireSectionItemType } from "@/models/QuestionnaireEnum"

export function getSectionsfromItems(item: any[]): QuestionnaireSection[] {
    if (item.length === 0) return []
    const uniqueSections = new Set<string>()
    const section: Record<string, Array<any>> = {}

    item.forEach((val) => {
        if (val.linkId === undefined) return

        // If key is not found create new entry
        if (!uniqueSections.has(val.linkId)) {
            uniqueSections.add(val.linkId)
            section[val.linkId] = [val]
            return
        }

        // Push the item to object
        section[val.linkId].push(val)
    })

    return Object.entries(section).map((val) => {
        const mapped = val[1].map((v) => {
            const parsedItem = {
                name: v.linkId ?? v.prefix,
                type: v.type,
                defaultValue:
                    v.type === QuestionaireSectionItemType.CHOICE
                        ? undefined
                        : v.answerOption?.at(0)?.valueString ??
                          v.answerOption?.at(0)?.valueBoolean ??
                          v.answerOption?.at(0)?.valueInteger,
                values:
                    v.type === QuestionaireSectionItemType.CHOICE
                        ? v.answerOption?.map((op: any) => {
                              return op?.valueString ?? op?.valueBoolean ?? op?.valueInteger
                          })
                        : undefined,
                required: v.required,
                readOnly: v.readOnly,
                maxLength: v.maxLength,
            } as QuestionnaireSectionItem

            if (parsedItem.defaultValue === undefined) {
                delete parsedItem.defaultValue
            }
            if (parsedItem.values === undefined) {
                delete parsedItem.values
            }

            return parsedItem
        })

        return {
            name: val[0],
            items: mapped,
        } as QuestionnaireSection
    })
}
