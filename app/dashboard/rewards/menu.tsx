'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function RewardMenu() {
  return (
    <menu className="w-full bg-white text-primary py-2 px-3 border rounded-md flex gap-2 items-center">
      <Link href={'/dashboard/reward'}>
        <h1 className="text-2xl font-semibold">Rewards</h1>
      </Link>
      <Link href={'/dashboard/rewards/create'} className="ml-auto ">
        <Button className="ml-auto ">Create</Button>
      </Link>
    </menu>
  );
}
