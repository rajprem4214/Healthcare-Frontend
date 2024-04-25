'use client';
import rewardApi from '@/app/api/reward';
// import { useToast } from "@/components/ui/use-toast"
import { DeepPartial } from '@/interface/helper';
import { Reward } from '@/models/reward';
import { getRewardModifyStore } from '@/store/reward/modify';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import ModifyBaseReward from '../_subpages/ModifyBaseReward/page';
import { rewardDetailsValidator } from '../_subpages/ModifyBaseReward/validators';
import ModifyConditions from '../_subpages/ModifyConditions/page';

// Conditional rendering for subpages
export default function ModifyPage() {
  const formStore = getRewardModifyStore();
  const formManager = useForm<z.infer<typeof rewardDetailsValidator>>({
    defaultValues: formStore.reward,
  });

  //   const { toast } = useToast();

  useEffect(() => {
    if (formStore.type !== 'UPDATE') {
      formStore.actions.reset();
    }
    return () => {};
  }, []);

  const createNew = async (data: z.infer<typeof rewardDetailsValidator>) => {
    let toastDismiss = () => {};
    try {
      await rewardApi.createReward(data);

      //   const dToast = toast({
      //     title: 'Reward Created',
      //     description: 'Sucessfully created a new reward',
      //     variant: 'default',
      //   });
      //   toastDismiss = dToast.dismiss;
    } catch (error) {
      //   const dToast = toast({
      //     title: 'Creation Failed',
      //     description: 'Failed to create a new reward',
      //     variant: 'destructive',
      //   });
      //   toastDismiss = dToast.dismiss;
    } finally {
      setTimeout(() => {
        toastDismiss();
      }, 700);
    }
  };

  const updateExisting = async (id: string, data: Partial<Reward>) => {
    let toastDismiss = () => {};
    const reward: DeepPartial<Reward> = {
      ...data,
      id: id,
    };
    try {
      await rewardApi.updateReward(reward);

      //   const dToast = toast({
      //     title: 'Reward Created',
      //     description: 'Sucessfully created a new reward',
      //     variant: 'default',
      //   });
      //   toastDismiss = dToast.dismiss;
    } catch (error) {
      //   const dToast = toast({
      //     title: 'Creation Failed',
      //     description: 'Failed to create a new reward',
      //     variant: 'destructive',
      //   });
      //   toastDismiss = dToast.dismiss;
    } finally {
      setTimeout(() => {
        toastDismiss();
      }, 700);
    }
  };

  const onFormSubmit = async (data: z.infer<typeof rewardDetailsValidator>) => {
    if (formStore.type === 'ADD') {
      await createNew(data);
      return;
    }

    if (formStore.type === 'UPDATE') {
      const dirtyFields = formManager.formState.dirtyFields;

      const dirtyKeys: Partial<Record<keyof Reward, any>> = {};

      Object.entries(dirtyFields).forEach((entry) => {
        const key = entry[0] as keyof Partial<Reward>;
        const value = entry[1];

        // Added all the dirty values
        if (value === true) {
          dirtyKeys[key] =
            data[key as keyof z.infer<typeof rewardDetailsValidator>];
        }
      });
      const existingConditions = formStore.reward.conditions ?? [];
      const dirtyConditions = data.conditions.filter((condition) => {
        return (
          existingConditions.findIndex((existCond) => {
            return (
              existCond.comparator === condition.comparator &&
              existCond.field === condition.field &&
              existCond.value === condition.value
            );
          }) === -1
        );
      });

      dirtyKeys.conditions = dirtyConditions;
      dirtyKeys.event = data.event;

      updateExisting(formStore.reward.id ?? '', dirtyKeys as Partial<Reward>);
    }
  };

  return (
    <div
      key={'modify_reward_root'}
      className="flex px-5 xl:px-10 gap- justify-evenly flex-wrap"
    >
      <div className="w-full 2xl:max-w-[650px] lg:max-w-[550px]">
        <ModifyBaseReward
          onSubmit={onFormSubmit}
          formManager={formManager}
        ></ModifyBaseReward>
      </div>
      <div className="w-full 2xl:max-w-[650px] lg:max-w-[550px]">
        <ModifyConditions formManager={formManager}></ModifyConditions>
      </div>
    </div>
  );
}
