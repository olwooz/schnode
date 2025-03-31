import { componentsAtom } from '@/atoms/component';
import { useBindings } from '@/hooks/useBindings';
import { BindingConfig, ComponentBinding } from '@/types/binding';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';

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

  return { config, tableColumns, handleColumnChange };
}
