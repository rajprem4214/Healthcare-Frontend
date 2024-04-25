import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select';

export type PaginationParams = {
  page: number;
  limit: number;
};

interface PaginationProps {
  paginationParams: PaginationParams;
  onPaginationChange: (params: PaginationParams) => void;
  totalCount?: number;
  rowsPerPageOptions?: number[];
}

export const Pagination = (props: PaginationProps) => {
  return (
    <div className="px-3 m-2 flex gap-3 justify-end items-center">
      <div className="flex gap-2 items-center">
        <span className="text-gray-500">Rows per page: </span>
        <Select
          onValueChange={(value: string) => {
            props.onPaginationChange({
              ...props.paginationParams,
              limit: parseInt(value),
            });
          }}
          defaultValue={props.paginationParams.limit.toString()}
        >
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Count" />
          </SelectTrigger>
          <SelectContent>
            {(props.rowsPerPageOptions ?? [10, 15, 20]).map((option) => (
              <SelectItem value={option.toString()} key={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <h2 className="text-gray-500">
        Page {(props.paginationParams.page ?? 0) + 1} of{' '}
        {Math.ceil((props.totalCount || 1) / props.paginationParams.limit)}
      </h2>
      <Button
        className="px-2 bg-white border text-primary hover:bg-gray-200"
        size={'icon'}
        onClick={() => {
          const prev = props.paginationParams;
          props.onPaginationChange({
            ...prev,
            page: prev.page < 1 ? prev.page : prev.page - 1,
          });
        }}
      >
        <ChevronLeft size={16} />
      </Button>
      <Button
        className="px-2 bg-white border text-primary hover:bg-gray-200"
        size={'icon'}
        onClick={() => {
          const prev = props.paginationParams;
          props.onPaginationChange({
            ...prev,
            page:
              prev.page + 1 <
              Math.ceil((props.totalCount || 1) / (prev.limit || 1))
                ? prev.page + 1
                : prev.page,
          });
        }}
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
};
