'use client';

import { useEffect, useState } from 'react';
import { Pencil, Trash2, Download } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PropertyComponentProps } from '@/types/component';
import { Column } from '@/types/table';
import { TableRowData } from '@/types/table';
import { useTable } from '@/hooks/useTable';
import { useComponentActions } from '@/hooks/useComponentActions';

export default function TableProperty({
  selectedComponent,
}: PropertyComponentProps) {
  const { handleUpdateComponent } = useComponentActions();
  const {
    columns,
    error,
    handleAddRow,
    handleAddColumn,
    handleDeleteColumn,
    handleUpdateColumn,
  } = useTable(selectedComponent);

  const [newColumn, setNewColumn] = useState<Column>({
    accessorKey: '',
    header: '',
  });
  const [newRow, setNewRow] = useState<Record<string, string>>({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedColumnAccessorKey, setSelectedColumnAccessorKey] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showColumnsDialog, setShowColumnsDialog] = useState(false);
  const [pendingColumns, setPendingColumns] = useState<Column[]>([]);
  const [loadedData, setLoadedData] = useState<TableRowData[]>([]);

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

  async function handleLoadFromApi() {
    setIsLoading(true);
    setApiError(null);

    try {
      const apiEndpoint = selectedComponent.props.apiEndpoint;

      if (!apiEndpoint) {
        setApiError('API endpoint URL is required');
        return;
      }

      const response = await fetch(apiEndpoint);

      if (!response.ok) {
        throw new Error(`Failed to load data: ${response.statusText}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('API response must be an array of objects');
      }

      if (data.length === 0) {
        throw new Error('API returned an empty array');
      }

      const rowsWithIds = data.map((row) => ({
        id: row.id || uuidv4(),
        ...row,
      }));

      setLoadedData(rowsWithIds);

      const firstRow = rowsWithIds[0];
      const detectedColumns = Object.keys(firstRow)
        .filter((key) => key !== 'id')
        .map((key) => ({
          accessorKey: key,
          header:
            key.charAt(0).toUpperCase() +
            key
              .slice(1)
              .replace(/([A-Z])/g, ' $1')
              .trim(),
        }));

      if (columns.length > 0) {
        setPendingColumns(detectedColumns);
        setShowColumnsDialog(true);
      } else {
        loadColumnsAndData(detectedColumns, rowsWithIds);
      }
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : 'Failed to load data'
      );
    } finally {
      setIsLoading(false);
    }
  }

  function loadColumnsAndData(newColumns: Column[], rowsData: TableRowData[]) {
    handleUpdateComponent({
      id: selectedComponent.id,
      key: 'columns',
      value: JSON.stringify(newColumns),
    });

    handleUpdateComponent({
      id: selectedComponent.id,
      key: 'data',
      value: JSON.stringify(rowsData),
    });

    setShowColumnsDialog(false);
  }

  function handleCancelLoad() {
    setShowColumnsDialog(false);
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
          onChange={(e) =>
            handleUpdateComponent({
              id: selectedComponent.id,
              key: 'title',
              value: e.target.value,
            })
          }
          placeholder='Enter table title'
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='apiEndpoint'>API Endpoint</Label>
        <div className='flex space-x-2'>
          <Input
            id='apiEndpoint'
            value={selectedComponent.props.apiEndpoint ?? ''}
            onChange={(e) =>
              handleUpdateComponent({
                id: selectedComponent.id,
                key: 'apiEndpoint',
                value: e.target.value,
              })
            }
            placeholder='https://api.example.com/data'
            className='flex-1'
          />
          <Button
            onClick={handleLoadFromApi}
            disabled={isLoading}
            variant='outline'
            className='flex-shrink-0'
          >
            {isLoading ? (
              <span className='flex items-center gap-1'>
                <span className='h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent'></span>
                Loading
              </span>
            ) : (
              <span className='flex items-center gap-1'>
                <Download className='h-4 w-4' />
                Load
              </span>
            )}
          </Button>
        </div>
        {apiError && (
          <div className='text-sm text-red-500 mt-1'>{apiError}</div>
        )}
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

      <Dialog open={showColumnsDialog} onOpenChange={setShowColumnsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Load Table Data</DialogTitle>
            <DialogDescription>
              The API data will override your current table data. Would you like
              to proceed?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant='outline' onClick={handleCancelLoad}>
              Cancel
            </Button>
            <Button
              onClick={() => loadColumnsAndData(pendingColumns, loadedData)}
            >
              Load Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {error && <div className='text-sm text-red-500 mt-2'>{error}</div>}
    </div>
  );
}
