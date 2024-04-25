import { DeepPartial } from '@/interface/helper';
import { PaginationFilter } from '@/interface/pagination';
import { Reward, RewardCondition } from '@/models/reward';
import axios from 'axios';

export async function getRewardList(
  page: number = 1,
  count: number = 10,
  filter: PaginationFilter = {}
) {
  const sortFilter = filter.sort
    ? `${filter.sort?.field}:${filter.sort?.value}`
    : undefined;

  const list = await axios.get(
    process.env.NEXT_PUBLIC_BACKEND_BASE + '/api/v1/reward/',
    {
      params: {
        sort: sortFilter,
        page: page,
        limit: count,
        get_reward_rules: true,
      },
      headers: {
        // Authorization: `${userStore.tokens.accessToken}`,
      },
    }
  );

  return (list.data?.data as Array<Reward>) ?? [];
}
export async function getRewardById(id: string) {
  const list = await axios.get(
    process.env.NEXT_PUBLIC_BACKEND_BASE + '/api/v1/reward/' + id,
    {
      headers: {
        // Authorization: `${userStore.tokens.accessToken}`,
      },
    }
  );

  return (list.data?.data as Reward) ?? [];
}

export async function createReward(reward: DeepPartial<Reward> = {}) {
  if (Object.keys(reward).length === 0) {
    throw new Error('Invalid Reward');
  }

  if (!Array.isArray(reward.conditions)) {
    reward.conditions = [];
  }

  reward.id = undefined;
  reward.createdAt = undefined;
  reward.updatedAt = undefined;

  //   const token = userStore.tokens.accessToken ?? '';

  //   if (token === '') {
  //     throw new Error('Invalid user access token found');
  //   }

  //   const resp = await axios.post(
  //     process.env.NEXT_PUBLIC_BACKEND_BASE + '/api/v1/reward/',
  //     reward,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );

  //   return resp.data?.id as string;
}

export async function deleteRewardCondition(
  condition: Partial<RewardCondition> = {}
) {
  if (Object.keys(condition).length === 0) {
    throw new Error('Invalid Reward Condition');
  }

  if (
    !condition.event ||
    !condition.comparator ||
    !condition.field ||
    condition.value === undefined
  ) {
    throw new Error('Missing important data');
  }

  //   const token = userStore.tokens.accessToken ?? '';

  //   if (token === '') {
  //     throw new Error('Invalid user access token found');
  //   }

  //   await axios.delete(
  //     process.env.NEXT_PUBLIC_BACKEND_BASE + '/api/v1/reward/condition',
  //     {
  //       headers: {
  //         // Authorization: `Bearer ${token}`,
  //       },
  //       params: {
  //         event: condition.event,
  //         field: condition.field,
  //         value: condition.value,
  //         comparator: condition.comparator,
  //       },
  //     }
  //   );
}

export async function updateReward(reward: DeepPartial<Reward> = {}) {
  if (Object.keys(reward).length === 0) {
    throw new Error('Invalid Reward');
  }

  if (!Array.isArray(reward.conditions)) {
    reward.conditions = [];
  }
  if (reward.id === undefined || reward.id.length === 0) {
    throw new Error('Invalid reward id');
  }

  reward.createdAt = undefined;
  reward.updatedAt = undefined;

  //   const token = userStore.tokens.accessToken ?? '';

  //   if (token === '') {
  //     throw new Error('Invalid user access token found');
  //   }

  //   const resp = await axios.patch(
  //     process.env.NEXT_PUBLIC_BACKEND_BASE + '/api/v1/reward/' + reward.id,
  //     reward,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );

  //   return resp.data?.id as string;
}
