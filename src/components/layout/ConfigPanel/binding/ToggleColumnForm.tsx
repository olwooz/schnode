'use client';

import { ComponentBinding } from '@/types/binding';
import { useBindColumn } from '@/hooks/useBindColumn';

interface ToggleColumnFormProps {
  binding: ComponentBinding;
}

export default function ToggleColumnForm({ binding }: ToggleColumnFormProps) {
  const { ColumnSelect } = useBindColumn(binding);

  return (
    <div className='space-y-4'>
      <h4 className='text-sm font-semibold'>Toggle Column Configuration</h4>

      <ColumnSelect />

      <div className='text-sm text-muted-foreground pt-2'>
        When checked, the checkbox will show the column. When unchecked, it will
        hide the column.
      </div>
    </div>
  );
}
