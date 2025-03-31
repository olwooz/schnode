import { Trash2, Pencil } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Column } from '@/types/table';

type TableColumnListProps = {
  columns: Column[];
  selectedColumnAccessorKey: string | null;
  handleSelectColumn: (column: Column) => void;
  handleDeleteColumn: (accessorKey: string) => void;
};

export function TableColumnList({
  columns,
  selectedColumnAccessorKey,
  handleSelectColumn,
  handleDeleteColumn,
}: TableColumnListProps) {
  return (
    <div className='space-y-2'>
      <Label className='text-sm font-medium'>Current Columns</Label>
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
  );
}
