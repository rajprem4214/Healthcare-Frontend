"use client"
import { useCreateRewardMutation } from "@/app/redux/apis/rewardsApiQ"
import { Reward, RewardStatus } from "@/models/reward"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import RewardConditionEditor from "../_components/RewardConditionEditor/RewardConditionEditor"
import RewardMetaEditor from "../_components/RewardMetaEditor/RewardMetaEditor"
import { rewardDetailsValidator } from "../_components/validators"

export default function CreateReward() {
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
    const [rewardCreateService] = useCreateRewardMutation()

    const onFormSubmit = async (data: Partial<Reward>) => {
        try {
            await rewardCreateService(data).unwrap()
            toast("Reward created sucessfully", { type: "success" })
            router.push("/dashboard/rewards")
        } catch (error) {
            toast("Failed to create a new reward", { type: "error" })
        }
    }

    return (
        <div
            key={"modify_reward_root"}
            className="flex px-5 xl:px-10 gap- justify-evenly flex-wrap">
            <div className="w-full 2xl:max-w-[650px] lg:max-w-[550px]">
                <RewardMetaEditor
                    onSubmit={onFormSubmit}
                    formManager={formHook}></RewardMetaEditor>
            </div>
            <div className="w-full 2xl:max-w-[650px] lg:max-w-[550px]">
                <RewardConditionEditor formManager={formHook}></RewardConditionEditor>
            </div>
        </div>
    )
}
