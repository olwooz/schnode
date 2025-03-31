'use client';

import { useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { ComponentBinding, BindingConfig } from '@/types/binding';
import { componentsAtom } from '@/atoms/component';

interface FilterTableFormProps {
  binding: ComponentBinding;
  updateBinding: (
    bindingId: string,
    updates: Partial<ComponentBinding>
  ) => boolean;
}

export default function FilterTableForm({
  binding,
  updateBinding,
}: FilterTableFormProps) {
  const components = useAtomValue(componentsAtom);
  const [config, setConfig] = useState<BindingConfig>({
    id: '',
  });

  const tableComponent = components.find((c) => c.id === binding.targetId);
  const tableColumns: { accessorKey: string; header: string }[] = tableComponent
    ?.props.columns
    ? JSON.parse(tableComponent.props.columns)
    : [];

  useEffect(() => {
    if (!binding.config) {
      return;
    }

    setConfig(binding.config);
  }, [binding.config]);

  function handleColumnChange(columnId: string) {
    const selectedColumn = tableColumns.find((col) => col.header === columnId);
    const accessorKey = selectedColumn?.accessorKey || '';

    const newConfig = { ...config, id: accessorKey };
    setConfig(newConfig);
    updateBinding(binding.id, { config: newConfig });
  }

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
