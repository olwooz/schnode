import { TABLE_FILTER_FUNCTION } from '@/constants/table';

export type FilterFunction =
  (typeof TABLE_FILTER_FUNCTION)[keyof typeof TABLE_FILTER_FUNCTION];

export type Column = {
  accessorKey: string;
  header: string;
  filterFn: FilterFunction;
};

export type TableRowData = {
  id: string;
  [key: string]: string;
};
