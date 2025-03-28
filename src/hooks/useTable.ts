import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { CanvasComponent } from '@/types/dnd';

export interface TableRow {
  id: string;
  [key: string]: unknown;
}

export interface TableColumn {
  accessorKey: string;
  header: string;
}

export function useTable(
  selectedComponent: CanvasComponent,
  handlePropChange: (propName: string, value: string) => void
) {
  const [rows, setRows] = useState<TableRow[]>(
    selectedComponent.props.data ? JSON.parse(selectedComponent.props.data) : []
  );
  const [columns, setColumns] = useState<TableColumn[]>(
    selectedComponent.props.columns
      ? JSON.parse(selectedComponent.props.columns)
      : []
  );
  const [error, setError] = useState<string | null>(null);

  function validateColumnKey(key: string): string | null {
    if (!key.trim()) return 'Column key is required';

    if (!/^[a-zA-Z0-9_]+$/.test(key)) {
      return 'Column key can only contain letters, numbers, and underscores';
    }

    const reservedKeys = ['id', '__proto__', 'constructor', 'prototype'];
    if (reservedKeys.includes(key)) {
      return `"${key}" is a reserved key`;
    }

    const existingKeys = columns.map((col) => col.accessorKey);
    if (existingKeys.includes(key)) {
      return `Column key "${key}" already exists`;
    }

    return null;
  }

  function updateRows(newRows: TableRow[]) {
    setRows(newRows);
    handlePropChange('data', JSON.stringify(newRows));
  }

  function updateColumns(newColumns: TableColumn[]) {
    setColumns(newColumns);
    handlePropChange('columns', JSON.stringify(newColumns));
  }

  function handleAddRow(rowData: Record<string, unknown> = {}) {
    const newRow: TableRow = {
      id: uuidv4(),
      ...rowData,
    };

    updateRows([...rows, newRow]);
  }

  function handleDeleteRow(id: string) {
    updateRows(rows.filter((row) => row.id !== id));
  }

  function handleUpdateRow(
    rowId: string,
    propName: string,
    propValue: unknown
  ) {
    updateRows(
      rows.map((row) => {
        if (row.id !== rowId) return row;

        return {
          ...row,
          [propName]: propValue,
        };
      })
    );
  }

  function handleAddColumn(column: TableColumn) {
    if (!column.accessorKey || !column.header) {
      return;
    }

    const keyError = validateColumnKey(column.accessorKey);
    if (keyError) {
      setError(keyError);
      return;
    }

    const newColumnsArray = [...columns, column];
    updateColumns(newColumnsArray);
    setError(null);
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

  function handleUpdateColumn(
    accessorKey: string,
    updates: Partial<TableColumn>
  ) {
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
    error,
    handleAddRow,
    handleDeleteRow,
    handleUpdateRow,
    handleAddColumn,
    handleDeleteColumn,
    handleUpdateColumn,
  };
}
