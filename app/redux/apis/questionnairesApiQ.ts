import { getSectionsfromItems } from "@/utils/questionnaire"
import { getAppropriateFHIRQuestionnaireInitial } from "@/utils/utils"
import { createApi } from "@reduxjs/toolkit/query/react"
import { fetchBaseQuery } from "../utils"

const questionnairesApiQ = createApi({
    reducerPath: "QuestionnairesApiQ",
    // if you dont give tags, caching wont happen
    tagTypes: ["Questionnaires"],
    baseQuery: fetchBaseQuery(),
    endpoints: (builder) => ({
        getQuestionnairesList: builder.query<
            QuestionnaireListResponse,
            {
                sort: any
                page: number
                limit: number
            }
        >({
            query: ({ sort, page, limit }) => {
                const searchQueryParams = new URLSearchParams({
                    page: page.toString(),
                    limit: limit.toString(),
                })
                if (sort) {
                    searchQueryParams.append("sort", sort)
                }
                return "/questionnaire?" + searchQueryParams.toString()
            },
            // provide tags actually tags the data for caching purposes;
            providesTags: (data) => [{ type: "Questionnaires", id: "LIST" }],

            transformResponse: (data: ApiResponse<any>) => {
                if (data?.data) {
                    const questionnaires = data.data.data ?? []

                    // TODO: add all questionnaire transformations here
                    return {
                        ...data?.data,
                        data: questionnaires.map((value: any) => ({
                            ...value,
                            subject: value.subjectType,
                            lastUpdated: value.meta.lastUpdated,
                        })),
                    }
                }
                return data?.data
            },
        }),
        getQuestionnaire: builder.query<
            Questionnaire,
            {
                id: string
            }
        >({
            query: ({ id }) => {
                return "/questionnaire/" + id
            },
            // provide tags actually tags the data for caching purposes;
            providesTags: (data) => [{ type: "Questionnaires", id: "GET_ONE" }],

            transformResponse: (data: ApiResponse<any>) => {
                if (data?.data) {
                    const questionnaire = data.data ?? {}

                    if (Array.isArray(questionnaire.item)) {
                        questionnaire.item.forEach(() => {})
                    }

                    // TODO: add all questionnaire transformations here
                    return {
                        name: questionnaire.name,
                        description: questionnaire.description,
                        status: questionnaire.status,
                        title: questionnaire.title,
                        id: questionnaire.id,
                        sections: getSectionsfromItems(questionnaire.item),
                        lastUpdated: questionnaire.meta?.lastUpdated,
                        effectivePeriod:
                            typeof questionnaire.effectivePeriod === "object"
                                ? {
                                      end: questionnaire.effectivePeriod?.end,
                                      start: questionnaire.effectivePeriod?.start,
                                  }
                                : undefined,
                        subject: questionnaire.subjectType?.at(0),
                    } as Questionnaire
                }
                return data?.data
            },
        }),
        addNewQuestionnaire: builder.mutation<Partial<Questionnaire>, Partial<Questionnaire>>({
            query: (data) => {
                const sendData = {
                    ...data,
                    item: data?.sections
                        ?.map((sec) => {
                            return sec.items.map((item) => {
                                return {
                                    linkId: item.name,
                                    prefix: item.name,
                                    type: item.type,
                                    required: Boolean(item.required),
                                    readOnly: Boolean(item.readOnly),
                                    maxLength:
                                        typeof item.maxLength === "number" ? parseInt(item.maxLength + "") : undefined,
                                    initial: item.defaultValue
                                        ? [{ ...getAppropriateFHIRQuestionnaireInitial(item.defaultValue) }]
                                        : undefined,
                                    answerOption:
                                        Array.isArray(item.values) && item.values.length > 0
                                            ? item.values.map((val) => {
                                                  return { valueString: val }
                                              })
                                            : undefined,
                                }
                            })
                        })
                        .flat(1),
                    sections: undefined,
                    version: new Date().toISOString(),
                }

                return {
                    body: sendData,
                    url: "questionnaire",
                    method: "POST",
                }
            },
        }),
        updateQuestionnaire: builder.mutation<
            Partial<Questionnaire>,
            {
                id: string
                data: Partial<Questionnaire>
            }
        >({
            query: ({ data, id }) => {
                const sendData = {
                    ...data,
                    id: id,
                    item: data?.sections
                        ?.map((sec) => {
                            return sec.items.map((item) => {
                                return {
                                    linkId: item.name,
                                    prefix: item.name,
                                    type: item.type,
                                    required: Boolean(item.required),
                                    readOnly: Boolean(item.readOnly),
                                    maxLength:
                                        typeof item.maxLength === "number" ? parseInt(item.maxLength + "") : undefined,
                                    initial: item.defaultValue
                                        ? [{ ...getAppropriateFHIRQuestionnaireInitial(item.defaultValue) }]
                                        : undefined,
                                    answerOption:
                                        Array.isArray(item.values) && item.values.length > 0
                                            ? item.values.map((val) => {
                                                  return { valueString: val }
                                              })
                                            : undefined,
                                }
                            })
                        })
                        .flat(1),
                    sections: undefined,
                    version: new Date().toISOString(),
                    subjectType: data.subject ? [data.subject] : [],
                }

                return {
                    body: sendData,
                    url: "questionnaire/" + id,
                    method: "PUT",
                }
            },
        }),
    }),
})

export { questionnairesApiQ }

export const {
    useGetQuestionnairesListQuery,
    useAddNewQuestionnaireMutation,
    useGetQuestionnaireQuery,
    useUpdateQuestionnaireMutation,
} = questionnairesApiQ
