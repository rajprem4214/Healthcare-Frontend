'use client';

import {
  ColumnDef,
  OnChangeFn,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/datatable/table';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  RefreshCcwIcon,
} from 'lucide-react';
import React from 'react';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_LIMIT = 10;

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onPaginationChange?: OnChangeFn<PaginationState>;
  onRefresh?: (state: PaginationState) => void;
  maxPage?: number;
  pageOptions?: PaginationState;
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  maxPage,
  onPaginationChange,
  pageOptions,
  onRefresh,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: maxPage ?? -1,
    debugTable: process.env.NODE_ENV === 'development',
    onPaginationChange: onPaginationChange,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      pagination: pageOptions ?? {
        pageIndex: DEFAULT_PAGE,
        pageSize: DEFAULT_PAGE_LIMIT,
      },
      sorting: sorting,
    },
  });

  return (
    <div className="w-full px-5">
      <div className="flex items-center justify-end  ">
        <div className="mx-auto flex items-center justify-center gap-3 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon></ChevronLeftIcon> Previous
          </Button>
          <p className="bg-gray-200 px-3 py-1 rounded-md select-none">
            {pageOptions?.pageIndex ?? 1}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next <ChevronRightIcon></ChevronRightIcon>
          </Button>
        </div>

        <div className="">
          <Button
            className="rounded-full w-11 h-11 p-3"
            variant={'ghost'}
            onClick={(e) => {
              if (typeof onRefresh === 'function') {
                onRefresh({
                  pageIndex:
                    table.options.state.pagination?.pageIndex ?? DEFAULT_PAGE,
                  pageSize:
                    table.options.state.pagination?.pageSize ??
                    DEFAULT_PAGE_LIMIT,
                });
              }
            }}
          >
            <RefreshCcwIcon></RefreshCcwIcon>
          </Button>
        </div>
      </div>
      <div className="rounded-md border w-full">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isLoading ? (
              <>
                {new Array(3).fill(0).map((_, idx) => {
                  return (
                    <TableRow key={idx}>
                      {new Array(columns.length).fill(0).map((_, idx) => {
                        return (
                          <TableCell key={idx}>
                            <Skeleton className="w-full h-2"></Skeleton>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
