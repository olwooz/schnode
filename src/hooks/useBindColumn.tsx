import { useEffect, useState } from 'react';

import { useAtomValue } from 'jotai';

import { componentsAtom } from '@/atoms/component';
import { Label } from '@/components/ui/label';
import { SelectItem } from '@/components/ui/select';
import { Select, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SelectContent } from '@/components/ui/select';
import { useBindings } from '@/hooks/useBindings';
import { BindingConfig, ComponentBinding } from '@/types/binding';

export function useBindColumn(binding: ComponentBinding) {
  const { updateBinding } = useBindings();
  const components = useAtomValue(componentsAtom);
  const [config, setConfig] = useState<BindingConfig>({
    id: '',
  });

  const tableComponent = components.find((c) => c.id === binding.targetId);
  const tableColumns: { accessorKey: string; header: string }[] = tableComponent
    ?.props.columns
    ? JSON.parse(tableComponent.props.columns)
    : [];

  function handleColumnChange(columnId: string) {
    const selectedColumn = tableColumns.find((col) => col.header === columnId);
    const accessorKey = selectedColumn?.accessorKey || '';

    const newConfig = { ...config, id: accessorKey };
    setConfig(newConfig);
    updateBinding(binding.id, { config: newConfig });
  }

  useEffect(() => {
    if (!binding.config) {
      return;
    }

    setConfig(binding.config);
  }, [binding.config]);

  const ColumnSelect = () => {
    return (
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
    );
  };

  return { ColumnSelect };
}
