'use client';
import { useGetRewardsListQuery } from '@/app/redux/apis/rewardsApiQ';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/datatable';
import {
  Pagination,
  PaginationParams,
} from '@/components/ui/datatable/pagination';
import { Reward } from '@/models/reward';
import { ColumnDef } from '@tanstack/react-table';
import { ChevronsUpDownIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RewardList() {
  const router = useRouter();

  const columns: ColumnDef<Reward>[] = [
    {
      accessorKey: 'id',
      header: 'Sr No.',
      enableHiding: true,
    },
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'event',
      header: ({ column }) => {
        return (
          <Button
            variant={'ghost'}
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Event
            <ChevronsUpDownIcon className="w-4 h-4 ml-4"></ChevronsUpDownIcon>
          </Button>
        );
      },
      cell({ row }) {
        return (
          <p className="capitalize">
            {String(row.getValue('event')).split('_').join(' ')}
          </p>
        );
      },
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => {
        return (
          <Button
            variant={'ghost'}
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Amount
            <ChevronsUpDownIcon className="w-4 h-4 ml-4"></ChevronsUpDownIcon>
          </Button>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell(props) {
        return <p className="capitalize">{props.row.getValue('status')}</p>;
      },
    },
    {
      accessorKey: 'updatedAt',
      header: 'Last Modified',
      cell(props) {
        return (
          <p>
            {Object.prototype.toString.call(
              new Date(props.row.getValue('updatedAt'))
            ) === '[object Date]' && (
              <p>
                {new Date(props.row.getValue('updatedAt')).toLocaleString()}
              </p>
            )}
          </p>
        );
      },
    },
    {
      id: 'tableOperations',
      header: 'Actions',
      cell({ row }) {
        return (
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onEdit(row.getValue('id'));
            }}
            className="bg-green-600 hover:bg-green-500"
          >
            Edit
          </Button>
        );
      },
    },
  ];

  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    limit: 10,
    page: 1,
  });

  const rewardList = useGetRewardsListQuery({
    sort: null,
    page: paginationParams.page,
    limit: paginationParams.limit,
  });

  const onEdit = (id: string) => {
    if (id == '') return;

    router.push('/dashboard/rewards/edit/' + id);
  };

  return (
    <section className="w-full">
      <div className="border mt-2 rounded-md bg-white border-gray-200 shadow-md">
        <DataTable
          isLoading={rewardList.isLoading}
          columns={columns}
          data={rewardList.data?.data ?? []}
        >
          <Pagination
            paginationParams={paginationParams}
            totalCount={rewardList.data?.count}
            onPaginationChange={setPaginationParams}
          />
        </DataTable>
      </div>
    </section>
  );
}
