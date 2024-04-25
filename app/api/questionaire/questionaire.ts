// import axios from "axios"
// import { PaginationFilter } from "@/interface/pagination"
// import * as CustomQuestionnaire from "@/models/questionaire"

// import { Questionnaire } from "@medplum/fhirtypes"

// export async function addQuestionaire(data: CustomQuestionnaire.Questionnaire) {
//     const date = new Date()

//     const items = data.sections.map((section) => {
//         let mappedItems = section.items.map((item) => {
//             const mappedItem: any = {
//                 linkId: section.name,
//                 prefix: item.name,
//                 type: item.type,
//                 required: item.required,
//                 readOnly: item.readOnly,
//                 maxLength: item.maxLength,
//             }
//             if (Array.isArray(item.values)) {
//                 mappedItem.answerOption = item.values.map((value) => {
//                     return {
//                         valueString: value,
//                     }
//                 })
//             }
//             return mappedItem
//         })
//         return mappedItems
//     })
//     const flatItems = items.flat()
//     const sendData: Questionnaire = {
//         resourceType: "Questionnaire",
//         version:
//             (data.name.replaceAll(" ", "-") ?? "") +
//             `${date.getUTCFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()}`,
//         name: data.name,
//         title: data.title,
//         status: data.status,
//         description: data.description,
//         effectivePeriod:
//             typeof data.effectivePeriod === "object"
//                 ? {
//                       start: data.effectivePeriod.start.toISOString(),
//                       end: data.effectivePeriod.end.toISOString(),
//                   }
//                 : undefined,
//         item: flatItems,
//     }
//     const userStore = getUserStore()

//     await axios.post(process.env.NEXT_PUBLIC_BACKEND_BASE + "/api/v1/questionnaire/", sendData, {
//         headers: {
//             Authorization: `${userStore.tokens.accessToken}`,
//         },
//     })

//     return
// }

// export async function updateQuestionnaire(id: string, data: CustomQuestionnaire.Questionnaire) {
//     if (id === "") {
//         throw new Error("error invalid questionnaire id")
//     }
//     const date = new Date()

//     const items = data.sections.map((section) => {
//         let mappedItems = section.items.map((item) => {
//             const mappedItem: any = {
//                 linkId: section.name,
//                 prefix: item.name,
//                 type: item.type,
//                 required: item.required,
//                 readOnly: item.readOnly,
//                 maxLength: item.maxLength,
//             }
//             if (Array.isArray(item.values)) {
//                 mappedItem.answerOption = item.values.map((value) => {
//                     return {
//                         valueString: value,
//                     }
//                 })
//             }
//             return mappedItem
//         })
//         return mappedItems
//     })
//     const flatItems = items.flat()
//     const sendData: Questionnaire = {
//         id: id,
//         resourceType: "Questionnaire",
//         version:
//             (data.name.replaceAll(" ", "-") ?? "") +
//             `${date.getUTCFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()}`,
//         name: data.name,
//         title: data.title,
//         status: data.status,
//         description: data.description,
//         effectivePeriod:
//             typeof data.effectivePeriod === "object"
//                 ? {
//                       start: data.effectivePeriod.start.toISOString(),
//                       end: data.effectivePeriod.end.toISOString(),
//                   }
//                 : undefined,
//         item: flatItems,
//     }

//     const userStore = getUserStore()

//     await axios.put(process.env.NEXT_PUBLIC_BACKEND_BASE + "/api/v1/questionnaire/" + sendData.id, sendData, {
//         headers: {
//             Authorization: `${userStore.tokens.accessToken}`,
//         },
//     })

//     return
// }
// export async function getQuestionaireList(page: number = 1, count: number = 10, filter: PaginationFilter = {}) {
//     const sortFilter = filter.sort ? `${filter.sort?.field}:${filter.sort?.value}` : undefined

//     const userStore = getUserStore()

//     const list = await axios.get(process.env.NEXT_PUBLIC_BACKEND_BASE + "/api/v1/questionnaire/", {
//         params: {
//             sort: sortFilter,
//             page: page,
//             limit: count,
//         },
//         headers: {
//             Authorization: `${userStore.tokens.accessToken}`,
//         },
//     })

//     return (list.data?.data?.data as Array<Questionnaire>) ?? []
// }
