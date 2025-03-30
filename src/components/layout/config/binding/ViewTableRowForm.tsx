'use client';

import { useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { X } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { ComponentBinding, ViewTableRowConfig } from '@/types/binding';
import { componentsAtom } from '@/atoms/component';
import { isViewTableRowConfig } from '@/utils/binding';

interface ViewTableRowFormProps {
  binding: ComponentBinding;
  updateBinding: (
    bindingId: string,
    updates: Partial<ComponentBinding>
  ) => boolean;
}

export default function ViewTableRowForm({
  binding,
  updateBinding,
}: ViewTableRowFormProps) {
  const components = useAtomValue(componentsAtom);
  const [config, setConfig] = useState<ViewTableRowConfig>({
    displayFields: [],
    allowEdit: true,
    allowDelete: true,
  });

  const tableComponent = components.find((c) => c.id === binding.targetId);
  const tableColumns: { accessorKey: string; header: string }[] = tableComponent
    ?.props.columns
    ? JSON.parse(tableComponent.props.columns)
    : [];

  useEffect(() => {
    if (binding.config && isViewTableRowConfig(binding.config)) {
      setConfig(binding.config);
    }
  }, [binding.config]);

  function handleAddField(fieldId: string) {
    if (config.displayFields.includes(fieldId)) {
      return;
    }

    const newDisplayFields = [...config.displayFields, fieldId];
    const newConfig = { ...config, displayFields: newDisplayFields };
    setConfig(newConfig);
    updateBinding(binding.id, { config: newConfig });
  }

  function handleRemoveField(fieldId: string) {
    const newDisplayFields = config.displayFields.filter(
      (id) => id !== fieldId
    );
    const newConfig = { ...config, displayFields: newDisplayFields };
    setConfig(newConfig);
    updateBinding(binding.id, { config: newConfig });
  }

  function handleAllowEditChange(allowEdit: boolean) {
    const newConfig = { ...config, allowEdit };
    setConfig(newConfig);
    updateBinding(binding.id, { config: newConfig });
  }

  function handleAllowDeleteChange(allowDelete: boolean) {
    const newConfig = { ...config, allowDelete };
    setConfig(newConfig);
    updateBinding(binding.id, { config: newConfig });
  }

  const availableColumns = tableColumns.filter(
    (column: { accessorKey: string }) =>
      !config.displayFields.includes(column.accessorKey)
  );

  return (
    <div className='space-y-4'>
      <h4 className='text-sm font-semibold'>View Table Row Configuration</h4>

      <div className='space-y-2'>
        <Label>Selected Display Fields</Label>
        <div className='border rounded-md p-3 min-h-10'>
          {config.displayFields.length > 0 ? (
            <div className='flex flex-wrap gap-2'>
              {config.displayFields.map((fieldId) => {
                const column = tableColumns.find(
                  (col: { accessorKey: string }) => col.accessorKey === fieldId
                );
                return (
                  <Badge
                    key={fieldId}
                    variant='secondary'
                    className='flex gap-1 items-center'
                  >
                    {column?.header || fieldId}
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-4 w-4 p-0 hover:bg-transparent'
                      onClick={() => handleRemoveField(fieldId)}
                    >
                      <X className='h-3 w-3' />
                    </Button>
                  </Badge>
                );
              })}
            </div>
          ) : (
            <div className='text-sm text-muted-foreground text-center'>
              No fields selected
            </div>
          )}
        </div>
      </div>

      <div className='space-y-2'>
        <Label>Available Fields</Label>
        <div className='flex flex-wrap gap-2'>
          {availableColumns.length > 0 ? (
            availableColumns.map(
              (column: { accessorKey: string; header: string }) => (
                <Button
                  key={column.accessorKey}
                  variant='outline'
                  size='sm'
                  onClick={() => handleAddField(column.accessorKey)}
                >
                  {column.header}
                </Button>
              )
            )
          ) : (
            <div className='text-sm text-muted-foreground'>
              All fields have been selected
            </div>
          )}
        </div>
      </div>

      <div className='space-y-4 pt-2'>
        <div className='flex items-center justify-between'>
          <Label htmlFor='allowEdit' className='flex-grow'>
            Allow Editing
          </Label>
          <Switch
            id='allowEdit'
            checked={config.allowEdit}
            onCheckedChange={handleAllowEditChange}
          />
        </div>

        <div className='flex items-center justify-between'>
          <Label htmlFor='allowDelete' className='flex-grow'>
            Allow Deleting
          </Label>
          <Switch
            id='allowDelete'
            checked={config.allowDelete}
            onCheckedChange={handleAllowDeleteChange}
          />
        </div>
      </div>

      <div className='text-sm text-muted-foreground pt-2'>
        The card will display and allow interaction with the selected table
        fields.
      </div>
    </div>
  );
}
