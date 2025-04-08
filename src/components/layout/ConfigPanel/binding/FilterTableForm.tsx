'use client';

import { useBindColumn } from '@/hooks/useBindColumn';
import { ComponentBinding } from '@/types/binding';

interface FilterTableFormProps {
  binding: ComponentBinding;
}

export default function FilterTableForm({ binding }: FilterTableFormProps) {
  const { ColumnSelect } = useBindColumn(binding);

  return (
    <div className='space-y-4'>
      <h4 className='text-sm font-semibold'>Table Filter Configuration</h4>

      <ColumnSelect />

      <div className='text-sm text-muted-foreground pt-2'>
        Input text will be used to filter the selected column based on the
        filter type chosen in the table column filter configuration.
      </div>
    </div>
  );
}
