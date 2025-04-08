import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Column } from '@/types/table';
import { validateRowData } from '@/utils/column-validation';

type TableRowFormProps = {
  columns: Column[];
  handleAddRow: (row: Record<string, string>) => void;
};

export function TableRowForm({ columns, handleAddRow }: TableRowFormProps) {
  const [newRow, setNewRow] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  function addRow() {
    const result = validateRowData(columns, newRow);

    if (!result.success) {
      const zodErrors = result.error.issues.reduce((acc, issue) => {
        acc[issue.path[0]] = issue.message;
        return acc;
      }, {} as Record<string, string>);

      setErrors(zodErrors);
      return;
    }

    handleAddRow(newRow);
    reset();
  }

  function reset() {
    setNewRow({});
    setErrors({});
  }

  return columns.length > 0 ? (
    <div className='space-y-4'>
      {columns.map((col) => (
        <div key={col.accessorKey} className='space-y-2'>
          <Label htmlFor={`row${col.accessorKey}`}>{col.header}</Label>
          <Input
            id={`row${col.accessorKey}`}
            className='row-input'
            value={newRow[col.accessorKey] ?? ''}
            onChange={(e) =>
              setNewRow({
                ...newRow,
                [col.accessorKey]: e.target.value,
              })
            }
            placeholder={`Enter ${col.header}`}
          />
          {errors[col.accessorKey] && (
            <p className='text-red-500 text-sm'>{errors[col.accessorKey]}</p>
          )}
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
