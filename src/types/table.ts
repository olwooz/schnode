import { TABLE_COLUMN_TYPE, TABLE_FILTER_FUNCTION } from '@/constants/table';

export type ColumnType =
  (typeof TABLE_COLUMN_TYPE)[keyof typeof TABLE_COLUMN_TYPE];

export type FilterFunction =
  (typeof TABLE_FILTER_FUNCTION)[keyof typeof TABLE_FILTER_FUNCTION];

export type Column = {
  accessorKey: string;
  header: string;
  filterFn: FilterFunction;
  type: ColumnType;
  required: boolean;
};

export type TableRowData = {
  id: string;
  [key: string]: string;
};
