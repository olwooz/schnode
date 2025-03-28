'use client';

import { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Trash2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PropertyComponentProps, TableProps } from '@/types/component';
import { Column } from '@/types/table';

export default function TableProperty({
  selectedComponent,
  handlePropChange,
}: PropertyComponentProps) {
  const tableProps = selectedComponent.props as TableProps;

  const currentColumns = useMemo(() => {
    try {
      return tableProps.columns
        ? (JSON.parse(tableProps.columns) as Column[])
        : [];
    } catch {
      return [];
    }
  }, [tableProps.columns]);

  const [newColumn, setNewColumn] = useState<Column>({
    accessorKey: '',
    header: '',
  });
  const [newRow, setNewRow] = useState<Record<string, string>>({});
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

    return null;
  }

  function handleAddColumn() {
    const keyError = validateColumnKey(newColumn.accessorKey);
    if (keyError) {
      setError(keyError);
      return;
    }

    if (!newColumn.header) {
      setError('Column header is required');
      return;
    }

    try {
      const currentColumnsData = [...currentColumns, newColumn];
      const columnsJson = JSON.stringify(currentColumnsData);

      handlePropChange('columns', columnsJson);

      setNewColumn({ accessorKey: '', header: '' });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred while adding the column');
      }
    }
  }

  function handleDeleteColumn(accessorKey: string) {
    try {
      const updatedColumns = currentColumns.filter(
        (col) => col.accessorKey !== accessorKey
      );
      handlePropChange('columns', JSON.stringify(updatedColumns));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred while deleting the column');
      }
    }
  }

  function handleAddRow() {
    try {
      const currentData = tableProps.data ? JSON.parse(tableProps.data) : [];

      const newRowData = {
        id: uuidv4(),
        ...Object.fromEntries(
          currentColumns.map((col) => [
            col.accessorKey,
            newRow[col.accessorKey],
          ])
        ),
      };

      const updatedData = [...currentData, newRowData];
      handlePropChange('data', JSON.stringify(updatedData));

      setNewRow(
        Object.fromEntries(currentColumns.map((col) => [col.accessorKey, '']))
      );
      setError(null);
    } catch {
      setError('An error occurred while adding the row');
    }
  }

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='title'>Table Title</Label>
        <Input
          id='title'
          value={selectedComponent.props.title ?? ''}
          onChange={(e) => handlePropChange('title', e.target.value)}
          placeholder='Enter table title'
        />
      </div>

      <Tabs defaultValue='columns' className='w-full pt-4'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='columns'>Columns</TabsTrigger>
          <TabsTrigger value='rows'>Rows</TabsTrigger>
        </TabsList>

        <TabsContent value='columns' className='space-y-4 pt-4'>
          <div className='space-y-2'>
            <Label>Current Columns</Label>
            <div className='max-h-40 overflow-y-auto rounded border p-2'>
              {currentColumns.length > 0 ? (
                <div className='space-y-2'>
                  {currentColumns.map((col) => (
                    <div
                      key={col.accessorKey}
                      className='flex items-center justify-between rounded bg-muted p-2 text-sm group relative'
                    >
                      <div className='flex-1'>
                        <span className='font-semibold'>{col.header}</span>
                        <span className='ml-2 text-xs text-muted-foreground'>
                          ({col.accessorKey})
                        </span>
                      </div>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity absolute right-1'
                        onClick={() => handleDeleteColumn(col.accessorKey)}
                      >
                        <Trash2 className='h-3 w-3 text-destructive' />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='py-2 text-center text-sm text-muted-foreground'>
                  No columns defined
                </div>
              )}
            </div>
          </div>

          <div className='pt-2'>
            <div className='text-sm font-medium mb-2'>Add New Column</div>
            <div className='space-y-2'>
              <Label htmlFor='columnKey'>Column Key</Label>
              <Input
                id='columnKey'
                value={newColumn.accessorKey ?? ''}
                onChange={(e) =>
                  setNewColumn({ ...newColumn, accessorKey: e.target.value })
                }
                placeholder='e.g. firstName'
              />
            </div>

            <div className='space-y-2 mt-2'>
              <Label htmlFor='columnHeader'>Column Header</Label>
              <Input
                id='columnHeader'
                value={newColumn.header ?? ''}
                onChange={(e) =>
                  setNewColumn({ ...newColumn, header: e.target.value })
                }
                placeholder='e.g. First Name'
              />
            </div>

            <Button onClick={handleAddColumn} className='w-full mt-4'>
              Add Column
            </Button>
          </div>
        </TabsContent>

        <TabsContent value='rows' className='space-y-4 pt-4'>
          <div className='space-y-4'>
            {currentColumns.map((col) => (
              <div key={col.accessorKey} className='space-y-2'>
                <Label htmlFor={`row${col.accessorKey}`}>{col.header}</Label>
                <Input
                  id={`row${col.accessorKey}`}
                  value={newRow[col.accessorKey] ?? ''}
                  onChange={(e) =>
                    setNewRow({ ...newRow, [col.accessorKey]: e.target.value })
                  }
                  placeholder={`Enter ${col.header}`}
                />
              </div>
            ))}
          </div>

          <Button onClick={handleAddRow} className='w-full'>
            Add Row
          </Button>
        </TabsContent>
      </Tabs>

      {error && <div className='text-sm text-red-500 mt-2'>{error}</div>}
    </div>
  );
}
