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

import { ComponentBinding } from '@/types/binding';
import { componentsAtom } from '@/atoms/component';
import { useBindings } from '@/hooks/useBindings';
import { ContentItem } from '@/types/card';

interface CardTableBindingFormProps {
  binding: ComponentBinding;
}

export default function CardTableBindingForm({
  binding,
}: CardTableBindingFormProps) {
  const components = useAtomValue(componentsAtom);
  const { updateBinding } = useBindings();

  const [mappings, setMappings] = useState<Record<string, string>>(
    binding.config.fieldMappings || {}
  );
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);

  const cardComponent = components.find((c) => c.id === binding.sourceId);
  const tableComponent = components.find((c) => c.id === binding.targetId);

  function handleSaveMapping(inputId: string, columnName: string) {
    const newMappings = {
      ...mappings,
      [inputId]: columnName,
    };

    setMappings(newMappings);

    updateBinding(binding.id, {
      ...binding,
      config: {
        ...binding.config,
        fieldMappings: newMappings,
      },
    });
  }

  useEffect(() => {
    if (!cardComponent?.props?.contentItems) return;

    try {
      const items = JSON.parse(cardComponent.props.contentItems);
      setContentItems(items);
    } catch (error) {
      console.error('Error parsing card content items', error);
    }
  }, [cardComponent?.props?.contentItems]);

  useEffect(() => {
    if (!tableComponent?.props?.columns) return;

    try {
      const columns = JSON.parse(tableComponent.props.columns);
      const columnNames = columns.map(
        (col: { accessorKey: string }) => col.accessorKey
      );
      setAvailableColumns(columnNames);
    } catch (error) {
      console.error('Error parsing table columns', error);
    }
  }, [tableComponent?.props?.columns]);

  return (
    <div className='space-y-4'>
      <div className='font-medium'>Table Action Configuration</div>

      <div className='space-y-2'>
        <Label>Field Mappings</Label>
        <p className='text-sm text-muted-foreground mb-2'>
          Map card inputs to table columns
        </p>

        {contentItems.length === 0 && (
          <div className='text-sm text-muted-foreground'>
            No input fields found in the card.
          </div>
        )}

        {contentItems.map((item) => (
          <div key={item.id} className='flex items-center gap-2 mb-2'>
            <div className='flex-1'>
              <Label>{item.props.label || item.id}</Label>
            </div>
            <div className='flex-1'>
              <Select
                value={mappings[item.id] || ''}
                onValueChange={(value) => handleSaveMapping(item.id, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select column' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='none'>None</SelectItem>
                  {availableColumns.map((col) => (
                    <SelectItem key={col} value={col}>
                      {col}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}

        <div className='text-sm text-amber-500 mt-2'>
          Note: For update and delete operations, make sure to map an input to
          the <code className='font-bold'>id</code> column.
        </div>
      </div>
    </div>
  );
}
