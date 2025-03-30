'use client';

import { useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { ComponentBinding, FilterTableConfig } from '@/types/binding';
import { componentsAtom } from '@/atoms/component';
import { isFilterTableConfig } from '@/utils/binding';

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
  const [config, setConfig] = useState<FilterTableConfig>({
    columnId: '',
    filterType: 'contains',
    caseSensitive: false,
  });

  const tableComponent = components.find((c) => c.id === binding.targetId);
  const tableColumns: { accessorKey: string; header: string }[] = tableComponent
    ?.props.columns
    ? JSON.parse(tableComponent.props.columns)
    : [];

  useEffect(() => {
    if (binding.config && isFilterTableConfig(binding.config)) {
      setConfig(binding.config);
    }
  }, [binding.config]);

  function handleColumnChange(columnId: string) {
    const newConfig = { ...config, columnId };
    setConfig(newConfig);
    updateBinding(binding.id, { config: newConfig });
  }

  function handleFilterTypeChange(filterType: FilterTableConfig['filterType']) {
    const newConfig = { ...config, filterType };
    setConfig(newConfig);
    updateBinding(binding.id, { config: newConfig });
  }

  function handleCaseSensitiveChange(caseSensitive: boolean) {
    const newConfig = { ...config, caseSensitive };
    setConfig(newConfig);
    updateBinding(binding.id, { config: newConfig });
  }

  return (
    <div className='space-y-4'>
      <h4 className='text-sm font-semibold'>Filter Table Configuration</h4>

      <div className='space-y-2'>
        <Label htmlFor='columnSelector'>Select Table Column to Filter</Label>
        <Select value={config.columnId} onValueChange={handleColumnChange}>
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

      <div className='space-y-2'>
        <Label htmlFor='filterType'>Filter Type</Label>
        <Select
          value={config.filterType}
          onValueChange={(value) =>
            handleFilterTypeChange(value as FilterTableConfig['filterType'])
          }
        >
          <SelectTrigger id='filterType'>
            <SelectValue placeholder='Select filter type' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='contains'>Contains</SelectItem>
            <SelectItem value='equals'>Equals</SelectItem>
            <SelectItem value='startsWith'>Starts With</SelectItem>
            <SelectItem value='endsWith'>Ends With</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='flex items-center justify-between'>
        <Label htmlFor='caseSensitive' className='flex-grow'>
          Case Sensitive
        </Label>
        <Switch
          id='caseSensitive'
          checked={config.caseSensitive}
          onCheckedChange={handleCaseSensitiveChange}
        />
      </div>

      <div className='text-sm text-muted-foreground pt-2'>
        The input value will be used to filter the table data based on the
        selected column and filter type.
      </div>
    </div>
  );
}
