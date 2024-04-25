'use client';
import { useGetQuestionnairesListQuery } from '@/app/redux/apis/questionnairesApiQ';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/datatable';
import {
  Pagination,
  PaginationParams,
} from '@/components/ui/datatable/pagination';

import { cn } from '@/lib/utils';
import { QuestionnaireStatus } from '@/models/QuestionnaireEnum';

import { ColumnDef } from '@tanstack/react-table';
// import { Questionnaire, QuestionnaireStatus } from '@/models/questionaire';
// import { getQuestionnaireList } from '@/store/questionaire/list';
// import { getNewQuestionaireFormStore } from '@/store/questionaire/new';
import { BarChart, Calendar, Edit, Hash, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
// import { useSnapshot } from 'valtio';

export default function QuestionnairesList() {
  const router = useRouter();

  const onEdit = (id: string) => {
    if (id == '') return;

    router.push('/dashboard/questionnaires/edit/' + id);
  };

  const tableColumns: ColumnDef<Questionnaire>[] = [
    {
      accessorKey: 'name',
      header: () => (
        <div className="flex gap-3">
          <Hash size={18} />
          Name
        </div>
      ),
      cell: ({ row }) => row.getValue('name') ?? '',
    },
    {
      accessorKey: 'status',
      header: () => (
        <div className="flex gap-3">
          <BarChart size={18} /> Status{' '}
        </div>
      ),
      cell: ({ row }) => {
        const status: Questionnaire['status'] | null = row.getValue('status');
        if (!status) return <></>;
        return (
          <Badge
            variant={
              (cn({
                destructive: status === QuestionnaireStatus.RETIRED,
                default: status === QuestionnaireStatus.ACTIVE,
                outline: status === QuestionnaireStatus.DRAFT,
              }) ?? 'default') as any
            }
            className="capitalize"
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'subject',
      header: () => (
        <div className="flex gap-3">
          <Tag size={18} />
          Subject
        </div>
      ),
    },
    {
      accessorKey: 'lastUpdated',
      maxSize: 2,
      header: () => (
        <div className="flex gap-3">
          <Calendar size={18} />
          Last updated
        </div>
      ),
      cell: ({ row }) => {
        const value: string | null = row.getValue('lastUpdated');
        if (!value) return null;
        return new Date(value).toDateString();
      },
    },
    {
      accessorKey: 'Actions',
      cell: ({ row }) => {
        return (
          <button
            onClick={() => {
              if (row.original.id) {
                onEdit(row.original.id);
              }
            }}
          >
            <Edit size={18} />
          </button>
        );
      },
    },
  ];

  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    limit: 10,
    page: 1,
  });

  const questionnaireList = useGetQuestionnairesListQuery({
    sort: null,
    page: paginationParams.page,
    limit: paginationParams.limit,
  });

  useEffect(() => {
    questionnaireList.refetch();
  }, [paginationParams]);

  return (
    <section className="w-full">
      <div className="border mt-2 rounded-md bg-white border-gray-200 shadow-md">
        <DataTable
          isLoading={questionnaireList.isLoading}
          columns={tableColumns}
          data={questionnaireList.data?.data ?? []}
        >
          <Pagination
            paginationParams={paginationParams}
            totalCount={questionnaireList.data?.count}
            onPaginationChange={setPaginationParams}
          />
        </DataTable>
      </div>
    </section>
  );
}
