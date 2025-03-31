import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Column } from '@/types/table';

type TableRowFormProps = {
  columns: Column[];
  handleAddRow: (row: Record<string, string>) => void;
};

export function TableRowForm({ columns, handleAddRow }: TableRowFormProps) {
  const [newRow, setNewRow] = useState<Record<string, string>>({});

  function addRow() {
    handleAddRow(newRow);
    resetNewRow();
  }

  function resetNewRow() {
    setNewRow({});
  }

  return columns.length > 0 ? (
    <div className='space-y-4'>
      {columns.map((col) => (
        <div key={col.accessorKey} className='space-y-2'>
          <Label htmlFor={`row${col.accessorKey}`}>{col.header}</Label>
          <Input
            id={`row${col.accessorKey}`}
            value={newRow[col.accessorKey] ?? ''}
            onChange={(e) =>
              setNewRow({
                ...newRow,
                [col.accessorKey]: e.target.value,
              })
            }
            placeholder={`Enter ${col.header}`}
          />
        </div>
      ))}
      <Button onClick={addRow} className='w-full'>
        Add Row
      </Button>
    </div>
  ) : (
    <div className='py-2 text-center text-sm text-muted-foreground'>
      Define columns first to add row data
    </div>
  );
}
