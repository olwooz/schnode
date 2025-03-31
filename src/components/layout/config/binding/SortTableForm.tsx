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

import { ComponentBinding, SortTableConfig } from '@/types/binding';
import { componentsAtom } from '@/atoms/component';
import { isSortTableConfig } from '@/utils/binding';

interface SortTableFormProps {
  binding: ComponentBinding;
  updateBinding: (
    bindingId: string,
    updates: Partial<ComponentBinding>
  ) => boolean;
}

export default function SortTableForm({
  binding,
  updateBinding,
}: SortTableFormProps) {
  const components = useAtomValue(componentsAtom);
  const [config, setConfig] = useState<SortTableConfig>({
    id: '',
  });

  const tableComponent = components.find((c) => c.id === binding.targetId);
  const tableColumns: { accessorKey: string; header: string }[] = tableComponent
    ?.props.columns
    ? JSON.parse(tableComponent.props.columns)
    : [];

  useEffect(() => {
    if (binding.config && isSortTableConfig(binding.config)) {
      setConfig(binding.config);
    }
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
      <h4 className='text-sm font-semibold'>Sort Table Configuration</h4>

      <div className='space-y-2'>
        <Label htmlFor='columnSelector'>Select Table Column to Sort</Label>
        <Select
          value={
            tableColumns.find((col) => col.accessorKey === config.id)?.header ||
            ''
          }
          onValueChange={handleColumnChange}
        >
          <SelectTrigger id='columnSelector'>
            <SelectValue placeholder='Select a column to sort' />
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
        The select component&apos;s selected value will determine the sort
        direction for the table.
      </div>
    </div>
  );
}
