export type Column = {
  accessorKey: string;
  header: string;
  filterFn: string;
};

export type TableRowData = {
  id: string;
  [key: string]: string;
};
