'use client';
import { useGetPatientsListQuery } from '@/app/redux/apis/patientApiQ';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { QuestionnaireStatus } from '@/models/QuestionnaireEnum';

// import { Questionnaire, QuestionnaireStatus } from '@/models/questionaire';
// import { getQuestionnaireList } from '@/store/questionaire/list';
// import { getNewQuestionaireFormStore } from '@/store/questionaire/new';
import { DataTable } from '@/components/ui/datatable';
import { Pagination } from '@/components/ui/datatable/pagination';
import { ColumnDef } from '@tanstack/react-table';
import {
  BadgeCheck,
  BarChart,
  Calendar,
  Copy,
  Edit,
  Hash,
  Mail,
  Phone,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
// import { useSnapshot } from 'valtio';

function mapStatustoColor(status?: QuestionnaireStatus) {
  if (status === undefined) return;
  switch (status) {
    case QuestionnaireStatus.ACTIVE:
      return 'bg-green-400';
    case QuestionnaireStatus.DRAFT:
      return 'bg-yellow-400';
    case QuestionnaireStatus.RETIRED:
      return 'bg-red-400';
    default:
      return 'bg-white';
  }
}

const CopyButton = ({
  textToCopy,
  className,
}: {
  textToCopy: string;
  className?: string;
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const copyContent = async () => {
    await navigator.clipboard.writeText(textToCopy);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div onClick={copyContent} className={cn(className)}>
      {!copied ? (
        <Copy size={14} />
      ) : (
        <BadgeCheck className="text-green-500" size={18} />
      )}
    </div>
  );
};

export default function PatientsList() {
  const router = useRouter();

  const tableColumns: ColumnDef<Patient>[] = [
    {
      accessorKey: 'id',
      header: () => (
        <div className="flex gap-3">
          <Hash size={18} />
          Sr No.
        </div>
      ),
      cell: ({ row }) => {
        return (
          <span className="text-center text-gray-800 ms-4">
            {row.index + 1}
          </span>
        );
      },
    },
    {
      accessorKey: 'email',
      header: () => (
        <div className="flex gap-3">
          <Mail size={18} />
          Email
        </div>
      ),
      cell: ({ row }) => {
        const email: string = row.getValue('email');
        return (
          <div className="flex items-center text-gray-800 gap-4 group pe-8 hover:pe-0">
            {email}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="group-hover:block hidden">
                  <CopyButton textToCopy={email ?? ''} />
                </TooltipTrigger>
                <TooltipContent className="bg-white text-gray-700 shadow-md border border-gray-300">
                  <p>Copy email</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
    {
      accessorKey: 'phoneNumber',
      header: () => (
        <div className="flex gap-3">
          <Phone size={18} />
          Phone No.
        </div>
      ),
      cell: ({ row }) => {
        const phoneNumber: string = row.getValue('phoneNumber');
        return <div className="text-gray-800">{phoneNumber}</div>;
      },
    },
    {
      accessorKey: 'active',
      header: () => (
        <div className="flex gap-3">
          <BarChart size={18} />
          Status
        </div>
      ),
      cell: ({ row }) => {
        const active: boolean = !!row.getValue('active');
        return (
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
        );
      },
    },
    {
      accessorKey: 'updatedAt',
      header: () => (
        <div className="flex gap-3">
          <Calendar size={18} />
          Last Updated
        </div>
      ),
      cell: ({ row }) => {
        const updatedAt: string | null = row.getValue('updatedAt');
        return (
          <span>{updatedAt ? new Date(updatedAt).toDateString() : ''}</span>
        );
      },
    },
    {
      header: 'Actions',
      cell: ({ row }) => (
        <>
          <button
            className="text-gray-800"
            onClick={() => {
              const id = row.original?.id;
              if (id) router.push('/dashboard/patient/' + id);
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

  const patientsList = useGetPatientsListQuery({
    page: paginationParams.page,
    limit: paginationParams.limit,
  });

  const onEdit = (id: string) => {
    // if (id == '') return;
    // const questionnaire = patientsList.data?.data?.find((val) => val.id === id);
    // if (questionnaire === undefined) return;
    // questionnaireForm.setForm(questionnaire as Questionnaire);
    // questionnaireForm.type = 'UPDATE';
    // router.push('/dashboard/questionnaire/modify/1');
  };

  return (
    <section className="w-full">
      <menu className="w-full py-2 px-3 border rounded-md flex gap-2 items-center bg-white">
        <h1 className="text-xl text-primary font-semibold p-1">Patients</h1>
      </menu>
      <div className="border mt-2 rounded-md bg-white border-gray-200 shadow-md">
        <DataTable
          isLoading={patientsList.isLoading}
          columns={tableColumns}
          data={patientsList.data?.data ?? []}
        >
          <Pagination
            paginationParams={paginationParams}
            totalCount={patientsList.data?.count}
            onPaginationChange={setPaginationParams}
          />
        </DataTable>
      </div>
    </section>
  );
}
