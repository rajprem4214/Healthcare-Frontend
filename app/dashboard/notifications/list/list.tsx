'use client';
import { useGetNotificationsListQuery } from '@/app/redux/apis/notificationsApiQ';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from '@/components/ui/table';
import { DataTable } from '@/components/ui/datatable';
import { ColumnDef } from '@tanstack/react-table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Contact,
  Copy,
  Edit,
  Edit2,
  Hash,
  Mail,
  Phone,
  Bell,
  RefreshCcw,
  CalendarIcon,
  BarChart,
  TagIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Pagination } from '@/components/ui/datatable/pagination';
import { useEffect, useState } from 'react';

const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const copyContent = async () => {
    await navigator.clipboard.writeText(textToCopy);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <button onClick={copyContent}>
      {!copied ? (
        <Copy size={18} />
      ) : (
        <BadgeCheck className="text-green-500" size={18} />
      )}
    </button>
  );
};


export default function NotificationsList() {

  const router = useRouter();

  const onEdit = (id: string) => {
    if (id == '') return;

    router.push('/dashboard/notifications/edit/' + id);
  };

  const tableColumns: ColumnDef<Notifications>[] = [
    {
      accessorKey: 'id',
      header: () => (
        <div className="flex gap-3">
          <Hash size={18} />
          Sr No.
        </div>
      ),
      cell: ({ row }) => {
        return <span className="flex text-gray-800 ms-4">{row.index + 1}</span>;
      },
    },
    {
      accessorKey: 'name',
      header: () => (
        <div className="flex gap-3">
          <Mail size={18} />
          Name
        </div>
      ),
      cell: ({ row }) => {
        const name: string = row.getValue('name');
        return <div className="flex text-gray-800 capitalize">{name}</div>;
      },
    },
    {
      accessorKey: 'medium',
      header: () => (
        <div className="flex gap-3">
          <Phone size={18} />
          Medium
        </div>
      ),
      cell: ({ row }) => {
        const medium: NotificationMedium = row.getValue('medium');
        return <div className="flex text-gray-800 capitalize">{Array.isArray(medium) ? (
          <span>{medium.join(', ')}</span>
        ) : (
          <span>{medium}</span>
        )}</div>;
      },
    },
    {
      accessorKey: 'tags',
      header: () => (
        <div className="flex gap-3">
          <TagIcon size={18} />
          Tags
        </div>
      ),
      cell: ({ row }) => {
        const tags: string = row.getValue('tags');
        return <div className="flex text-gray-800 capitalize">{tags}</div>;
      },
    },
    {
      accessorKey: 'status',
      header: () => (
        <div className="flex gap-3">
          <BarChart size={18} />
          Status
        </div>
      ),
      cell: ({ row }) => {
        const active: boolean =
          row.getValue('status') === 'active' ? true : false;
        return (
          <div className="flex">
            <Badge
              variant={
                (cn({
                  destructive: !active,
                  default: active,
                }) ?? 'default') as any
              }
              className="capitalize"
            >
              {active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: 'subject',
      header: () => (
        <div className="flex gap-3">
          <TagIcon size={18} />
          Subject
        </div>
      ),
      cell: ({ row }) => {
        const subject: string = row.getValue('subject');
        return <div className="flex text-gray-800 capitalize">{subject}</div>;
      },
    },
    {
      accessorKey: 'createdAt',
      header: () => (
        <div className="flex gap-3">
          <CalendarIcon size={18} />
          Last Updated
        </div>
      ),
      cell: ({ row }) => {
        const createdAt: string | null = row.getValue('createdAt');
        return (
          <span className="flex">
            {createdAt ? new Date(createdAt).toDateString() : ''}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      cell: ({ row }) => (
        <>
          <button
            onClick={() => {
              if (row.original.id) {
                onEdit(row.original.id);
              }
            }}
          >
            <Edit size={18} />
          </button>
        </>
      ),
    },
  ];

  const [paginationParams, setPaginationParams] = useState<{
    page: number;
    limit: number;
  }>({
    page: 0,
    limit: 10,
  });

  const notificationsList = useGetNotificationsListQuery({
    page: paginationParams.page,
    limit: paginationParams.limit,
  });

  // const onEdit = (id: string) => {
    // if (id == '') return;
    // const questionnaire = patientsList.data?.data?.find((val) => val.id === id);
    // if (questionnaire === undefined) return;
    // questionnaireForm.setForm(questionnaire as Questionnaire);
    // questionnaireForm.type = 'UPDATE';
    // router.push('/dashboard/questionnaire/modify/1');
  // };

  return (
    <section className="w-full">
      <div className="border mt-2 text-center rounded-md bg-white border-gray-200 shadow-md">
        <DataTable
          isLoading={notificationsList.isLoading}
          columns={tableColumns}
          data={notificationsList.data?.data ?? []}
          className=""
        >
          <Pagination
            paginationParams={paginationParams}
            totalCount={notificationsList.data?.count}
            onPaginationChange={setPaginationParams}
          />
        </DataTable>
      </div>
    </section>
  );
}
