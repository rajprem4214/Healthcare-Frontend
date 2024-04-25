"use client"
import { useGetRewardQuery, useUpdateRewardMutation } from "@/app/redux/apis/rewardsApiQ"
import { Card, CardContent } from "@/components/ui/card"
import { Reward, RewardCondition, RewardStatus } from "@/models/reward"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import RewardConditionEditor from "../../_components/RewardConditionEditor/RewardConditionEditor"
import RewardMetaEditor from "../../_components/RewardMetaEditor/RewardMetaEditor"
import { rewardDetailsValidator } from "../../_components/validators"

export default function EditReward() {
    const formHook = useForm<Partial<Reward>>({
        resolver: zodResolver(rewardDetailsValidator),
        defaultValues: {
            amount: 0,
            conditions: [],
            description: "",
            originResource: "",
            recurrenceCount: -1,
            status: RewardStatus.Draft,
            title: "",
        },
    })
    const router = useRouter()
    const params = useParams()
    const id = params.id as string
    const rewardFetch = useGetRewardQuery({ id: id ?? "" })

    const [rewardUpdateService] = useUpdateRewardMutation()

    /**
     *
     * @param old - The old conditions i.e the original array of conditions
     * @param modified - The new conditions i.e it includes all the conditions in current state including modified and unmodified
     */
    const performConditionDiffing = (old: Array<RewardCondition>, modified: Array<RewardCondition>) => {
        const dirtyConditions = modified.filter((condition) => {
            return (
                old.findIndex((existCond) => {
                    return (
                        existCond.comparator === condition.comparator &&
                        existCond.field === condition.field &&
                        existCond.value === condition.value
                    )
                }) === -1
            )
        })
        return dirtyConditions
    }

    const onFormSubmit = async (data: Partial<Reward>) => {
        const dirtyData: Partial<Record<keyof Reward, unknown>> = {}

        const fields = formHook.formState.dirtyFields

        console.log(fields)

        // Get all the dirty fields and store them in object
        Object.entries(fields).forEach((entry) => {
            const key = entry[0] as keyof Partial<Reward>
            const isDirty = entry[1]

            if (isDirty) {
                dirtyData[key] = data[key]
            }
        })

        // Update the conditions to contain only the newly added ones
        if (Array.isArray(dirtyData.conditions)) {
            const modifiedConditions = performConditionDiffing(rewardFetch.data?.conditions ?? [], dirtyData.conditions)
            dirtyData.conditions = modifiedConditions
        }

        dirtyData.id = id
        if (!dirtyData.event) {
            dirtyData.event = rewardFetch.data?.event
        }

        try {
            await rewardUpdateService(dirtyData as Partial<Reward>).unwrap()
            toast("Reward updated sucessfully", { type: "success" })
            router.push("/dashboard/rewards")
        } catch (error) {
            toast("Failed to update the  reward", { type: "error" })
        }
    }

    useEffect(() => {
        if (rewardFetch.isSuccess) {
            const data = rewardFetch.data
            formHook.reset({ ...data })
        }
    }, [rewardFetch.isSuccess])

    return (
        <>
            {rewardFetch.isLoading ? (
                <div>
                    <Card>
                        <CardContent className="flex items-center justify-center py-5">
                            <div role="status">
                                <svg
                                    aria-hidden="true"
                                    className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill"
                                    />
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <div
                    key={"modify_reward_root"}
                    className="flex px-5 xl:px-10 gap- justify-evenly flex-wrap">
                    <div className="w-full 2xl:max-w-[650px] lg:max-w-[550px]">
                        <RewardMetaEditor
                            isUpdate
                            onSubmit={onFormSubmit}
                            formManager={formHook}></RewardMetaEditor>
                    </div>
                    <div className="w-full 2xl:max-w-[650px] lg:max-w-[550px]">
                        <RewardConditionEditor
                            isUpdate
                            formManager={formHook}></RewardConditionEditor>
                    </div>
                </div>
            )}
        </>
    )
}
