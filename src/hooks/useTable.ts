import { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { fromZodError } from 'zod-validation-error';

import { useComponentActions } from '@/hooks/useComponentActions';
import { Column, TableRowData } from '@/types/table';
import { validateRowData } from '@/utils/table-validation';
import { BINDING_EVENT } from '@/constants/binding-event';

export function useTable(id: string, dataRaw: string, columnsRaw: string) {
  const { handleUpdateComponent } = useComponentActions();
  const rows = useMemo<TableRowData[]>(
    () => (dataRaw ? JSON.parse(dataRaw) : []),
    [dataRaw]
  );
  const columns = useMemo<Column[]>(
    () => (columnsRaw ? JSON.parse(columnsRaw) : []),
    [columnsRaw]
  );

  function validateRow(rowData: Record<string, string>) {
    const result = validateRowData(columns, rowData);
    if (!result.success) {
      const errorMessage = fromZodError(result.error)
        .message.split(/[:;]/)
        .slice(1);
      return errorMessage;
    }
    return null;
  }

  function dispatchTableActionResult(
    sourceId: string,
    errors: string[] | null
  ) {
    const event = new CustomEvent(BINDING_EVENT.TABLE_ACTION_RESULT, {
      detail: { sourceId, errors },
      bubbles: true,
    });
    document.dispatchEvent(event);
  }

  function updateRows(newRows: TableRowData[]) {
    handleUpdateComponent({
      id,
      key: 'data',
      value: JSON.stringify(newRows),
    });
  }

  function updateColumns(newColumns: Column[]) {
    handleUpdateComponent({
      id,
      key: 'columns',
      value: JSON.stringify(newColumns),
    });
  }

  function handleAddRow(
    rowData: Record<string, string> = {},
    sourceId?: string
  ) {
    const newRow: TableRowData = {
      id: uuidv4(),
      ...rowData,
    };

    const errorMessage = validateRow(newRow);

    if (sourceId) {
      dispatchTableActionResult(sourceId, errorMessage);
    }

    if (errorMessage) {
      return;
    }

    updateRows([...rows, newRow]);
  }

  function handleDeleteRow(id: string) {
    updateRows(rows.filter((row) => row.id !== id));
  }

  function handleUpdateRow(
    rowId: string,
    rowData: Record<string, string>,
    sourceId?: string
  ) {
    const targetRow = rows.find((row) => row.id === rowId);

    if (!targetRow) return;

    const newRow = { ...targetRow, ...rowData };

    const errorMessage = validateRow(newRow);

    if (sourceId) {
      dispatchTableActionResult(sourceId, errorMessage);
    }

    if (errorMessage) {
      return;
    }

    updateRows(
      rows.map((row) => {
        if (row.id !== rowId) return row;

        return newRow;
      })
    );
  }

  function handleAddColumn(column: Column) {
    const newColumnsArray = [...columns, column];
    updateColumns(newColumnsArray);
  }

  function handleDeleteColumn(accessorKey: string) {
    updateColumns(columns.filter((col) => col.accessorKey !== accessorKey));

    updateRows(
      rows.map((row) => {
        const newRow = { ...row };
        delete newRow[accessorKey];
        return newRow;
      })
    );
  }

  function handleUpdateColumn(accessorKey: string, updates: Partial<Column>) {
    if (updates.accessorKey && updates.accessorKey !== accessorKey) {
      updateRows(
        rows.map((row) => {
          const newRow = { ...row };
          if (accessorKey in newRow) {
            newRow[updates.accessorKey as string] = newRow[accessorKey];
            delete newRow[accessorKey];
          }
          return newRow;
        })
      );
    }

    updateColumns(
      columns.map((col) => {
        if (col.accessorKey !== accessorKey) return col;

        return {
          ...col,
          ...updates,
        };
      })
    );
  }

  return {
    rows,
    columns,
    handleAddRow,
    handleDeleteRow,
    handleUpdateRow,
    handleAddColumn,
    handleDeleteColumn,
    handleUpdateColumn,
  };
}
