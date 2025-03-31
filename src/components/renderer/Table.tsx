'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  Row,
  ColumnDef,
  VisibilityState,
  ColumnFiltersState,
  SortingState,
  getSortedRowModel,
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
import { TablePagination } from '@/components/renderer/TablePagination';
import { DEFAULT_PROPS } from '@/constants/component';
import { ComponentRendererProps, TableProps } from '@/types/component';
import { TableRowData } from '@/types/table';
import { isPreviewModeAtom } from '@/atoms/mode';
import { cn } from '@/lib/utils';
import { getBooleanValue } from '@/utils/string';

export default function TableRenderer({
  props,
  componentId,
}: ComponentRendererProps) {
  const isPreviewMode = useAtomValue(isPreviewModeAtom);
  const tableProps = { ...DEFAULT_PROPS.table, ...props } as TableProps;
  const [selectedRow, setSelectedRow] = useState<TableRowData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editedValues, setEditedValues] = useState<TableRowData>(
    {} as TableRowData
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnSorts, setColumnSorts] = useState<SortingState>([]);

  const data = useMemo<TableRowData[]>(
    () => (tableProps.data ? JSON.parse(tableProps.data) : []),
    [tableProps.data]
  );

  const columns = useMemo<ColumnDef<TableRowData>[]>(
    () => (tableProps.columns ? JSON.parse(tableProps.columns) : []),
    [tableProps.columns]
  );

  const showPagination = getBooleanValue(tableProps.showPagination);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnVisibility,
      columnFilters,
      sorting: columnSorts,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setColumnSorts,
  });

  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;
  const setPageSize = table.setPageSize;

  function handleRowClick(row: Row<TableRowData>) {
    if (isPreviewMode) {
      return;
    }

    setSelectedRow(row.original);
    setEditedValues(row.original);
    setIsDialogOpen(true);
  }

  useEffect(() => {
    if (!tableProps.pageSize) {
      return;
    }

    setPageSize(parseInt(tableProps.pageSize));
  }, [tableProps.pageSize, setPageSize]);

  useEffect(() => {
    const handleColumnToggle = (event: CustomEvent) => {
      const { accessorKey, isVisible, targetId } = event.detail;

      if (targetId !== componentId) {
        return;
      }

      setColumnVisibility((prev) => ({
        ...prev,
        [accessorKey]: isVisible,
      }));
    };

    const handleColumnReset = (event: CustomEvent) => {
      const { accessorKey, targetId } = event.detail;

      if (targetId !== componentId) {
        return;
      }

      setColumnVisibility((prev) => {
        const updated = { ...prev };
        delete updated[accessorKey];
        return updated;
      });
    };

    const handleTableFilter = (event: CustomEvent) => {
      const { id, filterValue, targetId } = event.detail;

      if (targetId !== componentId) {
        return;
      }

      setColumnFilters((prev) => {
        const filtered = prev.filter((filter) => filter.id !== id);

        if (filterValue) {
          return [
            ...filtered,
            {
              id,
              value: filterValue,
            },
          ];
        }

        return filtered;
      });
    };

    const handleTableFilterReset = (event: CustomEvent) => {
      const { id, targetId } = event.detail;

      if (targetId !== componentId) {
        return;
      }

      setColumnFilters((prev) => prev.filter((filter) => filter.id !== id));
    };

    const handleTableSort = (event: CustomEvent) => {
      const { id, desc, sort, targetId } = event.detail;

      if (targetId !== componentId) {
        return;
      }

      setColumnSorts((prev) => {
        const filtered = prev.filter((sort) => sort.id !== id);

        if (sort) {
          return [
            ...filtered,
            {
              id,
              desc,
            },
          ];
        }

        return filtered;
      });
    };

    const handleTableSortReset = (event: CustomEvent) => {
      const { id, targetId } = event.detail;

      if (targetId !== componentId) {
        return;
      }

      setColumnSorts((prev) => prev.filter((sort) => sort.id !== id));
    };

    document.addEventListener(
      'toggleColumn',
      handleColumnToggle as EventListener
    );

    document.addEventListener(
      'resetColumnVisibility',
      handleColumnReset as EventListener
    );

    document.addEventListener(
      'filterTable',
      handleTableFilter as EventListener
    );

    document.addEventListener(
      'resetTableFilter',
      handleTableFilterReset as EventListener
    );

    document.addEventListener('sortTable', handleTableSort as EventListener);

    document.addEventListener(
      'resetTableSort',
      handleTableSortReset as EventListener
    );
    return () => {
      document.removeEventListener(
        'toggleColumn',
        handleColumnToggle as EventListener
      );
      document.removeEventListener(
        'resetColumnVisibility',
        handleColumnReset as EventListener
      );
      document.removeEventListener(
        'filterTable',
        handleTableFilter as EventListener
      );
      document.removeEventListener(
        'resetTableFilter',
        handleTableFilterReset as EventListener
      );
      document.removeEventListener(
        'sortTable',
        handleTableSort as EventListener
      );
      document.removeEventListener(
        'resetTableSort',
        handleTableSortReset as EventListener
      );
    };
  }, [componentId]);

  return (
    <div className='w-[640px] space-y-4'>
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
                  className={cn(
                    'cursor-pointer hover:bg-muted/50',
                    isPreviewMode && 'cursor-default'
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className='max-w-[240px] overflow-hidden text-ellipsis'
                    >
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

      {showPagination && data.length > 0 && <TablePagination table={table} />}

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
