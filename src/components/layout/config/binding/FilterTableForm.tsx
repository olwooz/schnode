'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { ComponentBinding } from '@/types/binding';
import { useBindColumn } from '@/hooks/useBindColumn';

interface FilterTableFormProps {
  binding: ComponentBinding;
}

export default function FilterTableForm({ binding }: FilterTableFormProps) {
  const { config, tableColumns, handleColumnChange } = useBindColumn(binding);

  return (
    <div className='space-y-4'>
      <h4 className='text-sm font-semibold'>Table Filter Configuration</h4>

      <div className='space-y-2'>
        <Label htmlFor='columnSelector'>Select Table Column</Label>
        <Select
          value={
            tableColumns.find((col) => col.accessorKey === config.id)?.header ||
            ''
          }
          onValueChange={handleColumnChange}
        >
          <SelectTrigger id='columnSelector'>
            <SelectValue placeholder='Select a column to filter' />
          </SelectTrigger>
          <SelectContent>
            {tableColumns.map(
              (column: { accessorKey: string; header: string }) => (
                <SelectItem key={column.accessorKey} value={column.header}>
                  {column.header}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>

      <div className='text-sm text-muted-foreground pt-2'>
        Input text will be used to filter the selected column based on the
        filter type chosen in the table column filter configuration.
      </div>
    </div>
  );
}
