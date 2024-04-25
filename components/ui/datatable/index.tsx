import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import { Pagination } from './pagination';
import React from 'react';
import { Skeleton } from '../skeleton';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  className?: string;
  children?: React.ReactNode;
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  className,
  children,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const Headers = () => (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <TableHead key={header.id} colSpan={header.colSpan}>
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
  );

  const TableBodyWithData = () => (
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24">
            <div className="w-full flex items-center justify-center flex-col min-w-max min-h-[16rem]">
              <Inbox size={64} className="text-gray-400" />
              <p className="text-md text-gray-500">No items found.</p>
            </div>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );

  const TableBodySkeleton = () => (
    <TableBody>
      {new Array(5).fill(1).map((value, idx) => (
        <TableRow key={idx}>
          {new Array(columns.length).fill(1).map((value, idx) => (
            <TableCell key={idx}>
              <Skeleton className="w-full h-5"></Skeleton>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );

  return (
    <div>
      <div className={cn(className, 'rounded-md border')}>
        <Table>
          <Headers />
          {!isLoading ? <TableBodyWithData /> : <TableBodySkeleton />}
        </Table>
      </div>
      {children}
    </div>
  );
}
