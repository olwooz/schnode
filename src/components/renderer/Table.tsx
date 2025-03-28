'use client';

import { useMemo, useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  Row,
  ColumnDef,
} from '@tanstack/react-table';

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { TableRowEditor } from '@/components/renderer/TableRowEditor';
import { DEFAULT_PROPS } from '@/constants/component';
import { ComponentRendererProps, TableProps } from '@/types/component';
import { TableRowData } from '@/types/table';

interface ExtendedComponentProps extends ComponentRendererProps {
  componentId?: string;
}

export default function TableRenderer({ props }: ExtendedComponentProps) {
  const tableProps = { ...DEFAULT_PROPS.table, ...props } as TableProps;
  const [selectedRow, setSelectedRow] = useState<TableRowData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editedValues, setEditedValues] = useState<TableRowData>(
    {} as TableRowData
  );

  const data = useMemo<TableRowData[]>(
    () => (tableProps.data ? JSON.parse(tableProps.data) : []),
    [tableProps.data]
  );

  const columns = useMemo<ColumnDef<TableRowData>[]>(
    () => (tableProps.columns ? JSON.parse(tableProps.columns) : []),
    [tableProps.columns]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;

  function handleRowClick(row: Row<TableRowData>) {
    setSelectedRow(row.original);
    setEditedValues(row.original);
    setIsDialogOpen(true);
  }

  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-medium'>{tableProps.title}</h3>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {headerGroups.map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead className='bg-muted' key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => handleRowClick(row)}
                  className='cursor-pointer hover:bg-muted/50'
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TableRowEditor
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        data={data}
        editedValues={editedValues}
        setEditedValues={setEditedValues}
        selectedRow={selectedRow}
        columns={columns}
      />
    </div>
  );
}
