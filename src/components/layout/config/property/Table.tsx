'use client';

import { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PropertyComponentProps } from '@/types/component';
import { Column } from '@/types/table';
import { useTable } from '@/hooks/useTable';

export default function TableProperty({
  selectedComponent,
  handlePropChange,
}: PropertyComponentProps) {
  const {
    columns,
    error,
    handleAddRow,
    handleAddColumn,
    handleDeleteColumn,
    handleUpdateColumn,
  } = useTable(selectedComponent, handlePropChange);

  const [newColumn, setNewColumn] = useState<Column>({
    accessorKey: '',
    header: '',
  });
  const [newRow, setNewRow] = useState<Record<string, string>>({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedColumnAccessorKey, setSelectedColumnAccessorKey] = useState<
    string | null
  >(null);

  function addRow() {
    handleAddRow(newRow);
    resetNewRow();
  }

  function addColumn() {
    handleAddColumn(newColumn);
    resetNewColumn();
  }

  function updateColumn() {
    if (!selectedColumnAccessorKey) {
      return;
    }

    handleUpdateColumn(selectedColumnAccessorKey, newColumn);
    setIsEditMode(false);
    setSelectedColumnAccessorKey(null);
  }

  function resetNewRow() {
    setNewRow({});
  }

  function resetNewColumn() {
    setNewColumn({ accessorKey: '', header: '' });
  }

  function handleSelectColumn(column: Column) {
    setSelectedColumnAccessorKey(column.accessorKey);
    setNewColumn({
      accessorKey: column.accessorKey,
      header: column.header,
    });
    setIsEditMode(true);
  }

  function cancelEditMode() {
    setSelectedColumnAccessorKey(null);
    setIsEditMode(false);
    resetNewColumn();
  }

  useEffect(() => {
    resetNewRow();
    resetNewColumn();
  }, [selectedComponent]);

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
              {columns.length > 0 ? (
                <div className='space-y-2'>
                  {columns.map((col) => (
                    <div
                      key={col.accessorKey}
                      className={`flex items-center justify-between rounded bg-muted p-2 text-sm group relative ${
                        selectedColumnAccessorKey === col.accessorKey
                          ? 'bg-primary/20'
                          : ''
                      }`}
                    >
                      <div className='flex-1'>
                        <span className='font-semibold'>{col.header}</span>
                        <span className='ml-2 text-xs text-muted-foreground'>
                          ({col.accessorKey})
                        </span>
                      </div>
                      <div className='opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1'>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-6 w-6'
                          onClick={() => handleSelectColumn(col)}
                        >
                          <Pencil className='h-3 w-3' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-6 w-6'
                          onClick={() => handleDeleteColumn(col.accessorKey)}
                        >
                          <Trash2 className='h-3 w-3 text-destructive' />
                        </Button>
                      </div>
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
            <div className='text-sm font-medium mb-2'>
              {isEditMode ? 'Edit Column' : 'Add Column'}
            </div>
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

            <div className='flex space-x-2 mt-4'>
              <Button
                onClick={isEditMode ? updateColumn : addColumn}
                className='flex-1'
              >
                {isEditMode ? 'Update Column' : 'Add Column'}
              </Button>
              {isEditMode && (
                <Button
                  variant='outline'
                  onClick={cancelEditMode}
                  className='w-24'
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value='rows' className='space-y-4 pt-4'>
          <div className='space-y-4'>
            {columns.map((col) => (
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

          <Button onClick={addRow} className='w-full'>
            Add Row
          </Button>
        </TabsContent>
      </Tabs>

      {error && <div className='text-sm text-red-500 mt-2'>{error}</div>}
    </div>
  );
}
