'use client';

import { useMemo } from 'react';

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  Row,
} from '@tanstack/react-table';
import { DEFAULT_PROPS } from '@/constants/component';
import { Column } from '@/types/table';
import { ComponentRendererProps, TableProps } from '@/types/component';

export default function TableRenderer({ props }: ComponentRendererProps) {
  const tableProps = { ...DEFAULT_PROPS.table, ...props } as TableProps;

  const data = useMemo(() => {
    try {
      return tableProps.data ? JSON.parse(tableProps.data) : [];
    } catch (e) {
      console.error('Error parsing table data:', e);
      return [];
    }
  }, [tableProps.data]);

  const columns = useMemo(() => {
    try {
      const rawColumns: Column[] = tableProps.columns
        ? JSON.parse(tableProps.columns)
        : [];

      return rawColumns.map((col) => {
        return {
          accessorKey: col.accessorKey,
          header: col.header,
          cell: ({ row }: { row: Row<object> }) =>
            row.getValue(col.accessorKey),
        };
      });
    } catch (e) {
      console.error('Error processing table columns:', e);
      return [];
    }
  }, [tableProps.columns]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;

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
    </div>
  );
}
