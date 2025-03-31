'use client';

import { ComponentBinding } from '@/types/binding';
import { useBindColumn } from '@/hooks/useBindColumn';

interface SortTableFormProps {
  binding: ComponentBinding;
}

export default function SortTableForm({ binding }: SortTableFormProps) {
  const { ColumnSelect } = useBindColumn(binding);

  return (
    <div className='space-y-4'>
      <h4 className='text-sm font-semibold'>Sort Table Configuration</h4>

      <ColumnSelect />

      <div className='text-sm text-muted-foreground pt-2'>
        The select component&apos;s selected value will determine the sort
        direction for the table.
      </div>
    </div>
  );
}
