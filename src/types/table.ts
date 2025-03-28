export type Column = {
  accessorKey: string;
  header: string;
};

export type TableRowData = {
  id: string;
  [key: string]: string;
};
