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

import { ComponentBinding, ToggleColumnConfig } from '@/types/binding';
import { componentsAtom } from '@/atoms/component';
import { isToggleColumnConfig } from '@/utils/binding';

interface ToggleColumnFormProps {
  binding: ComponentBinding;
  updateBinding: (
    bindingId: string,
    updates: Partial<ComponentBinding>
  ) => boolean;
}

export default function ToggleColumnForm({
  binding,
  updateBinding,
}: ToggleColumnFormProps) {
  const components = useAtomValue(componentsAtom);
  const [config, setConfig] = useState<ToggleColumnConfig>({
    accessorKey: '',
    defaultVisible: true,
  });

  const tableComponent = components.find((c) => c.id === binding.targetId);
  const tableColumns: { accessorKey: string; header: string }[] = tableComponent
    ?.props.columns
    ? JSON.parse(tableComponent.props.columns)
    : [];

  useEffect(() => {
    if (binding.config && isToggleColumnConfig(binding.config)) {
      setConfig(binding.config);
    }
  }, [binding.config]);

  function handleColumnChange(columnId: string) {
    const selectedColumn = tableColumns.find((col) => col.header === columnId);
    const accessorKey = selectedColumn?.accessorKey || '';

    const newConfig = { ...config, accessorKey };
    setConfig(newConfig);
    updateBinding(binding.id, { config: newConfig });
  }

  return (
    <div className='space-y-4'>
      <h4 className='text-sm font-semibold'>Toggle Column Configuration</h4>

      <div className='space-y-2'>
        <Label htmlFor='columnSelector'>Select Table Column</Label>
        <Select
          value={
            tableColumns.find((col) => col.accessorKey === config.accessorKey)
              ?.header || ''
          }
          onValueChange={handleColumnChange}
        >
          <SelectTrigger id='columnSelector'>
            <SelectValue placeholder='Select a column to toggle' />
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
        When checked, the checkbox will show the column. When unchecked, it will
        hide the column.
      </div>
    </div>
  );
}
