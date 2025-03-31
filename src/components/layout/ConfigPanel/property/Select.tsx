import { useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { SELECT_DEFAULT_OPTIONS } from '@/constants/variant';
import { CanvasComponent } from '@/types/dnd';
import { useLocalFormState } from '@/hooks/useLocalFormState';
import {
  useComponentActions,
  UpdateComponentProps,
} from '@/hooks/useComponentActions';

type SelectPropertyProps = {
  selectedComponent: CanvasComponent;
  handleUpdateItemProp?: ({ id, key, value }: UpdateComponentProps) => void;
};

export default function SelectProperty({
  selectedComponent,
  handleUpdateItemProp,
}: SelectPropertyProps) {
  const { handleUpdateComponent } = useComponentActions();
  const [newOption, setNewOption] = useState('');

  const label = useLocalFormState(
    selectedComponent.props.label ?? '',
    (value) =>
      (handleUpdateItemProp ? handleUpdateItemProp : handleUpdateComponent)({
        id: selectedComponent.id,
        key: 'label',
        value,
      })
  );

  const placeholder = useLocalFormState(
    selectedComponent.props.placeholder ?? '',
    (value) =>
      (handleUpdateItemProp ? handleUpdateItemProp : handleUpdateComponent)({
        id: selectedComponent.id,
        key: 'placeholder',
        value,
      })
  );

  const options: string[] = selectedComponent.props.options
    ? JSON.parse(selectedComponent.props.options as string)
    : SELECT_DEFAULT_OPTIONS;

  function updateOptions(updatedOptions: string) {
    (handleUpdateItemProp ? handleUpdateItemProp : handleUpdateComponent)({
      id: selectedComponent.id,
      key: 'options',
      value: updatedOptions,
    });
  }

  function handleAddOption() {
    if (!newOption.trim()) return;

    const updatedOptions = [...options, newOption.trim()];
    updateOptions(JSON.stringify(updatedOptions));
    setNewOption('');
  }

  function handleRemoveOption(index: number) {
    const updatedOptions = options.filter(
      (_: string, i: number) => i !== index
    );
    updateOptions(JSON.stringify(updatedOptions));
  }

  function handleUpdateOption(index: number, value: string) {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    updateOptions(JSON.stringify(updatedOptions));
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key !== 'Enter') {
      return;
    }

    e.preventDefault();
    handleAddOption();
  }

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='select-label'>Label</Label>
        <Input
          id='select-label'
          value={label.value}
          onChange={(e) => label.setValue(e.target.value)}
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='select-placeholder'>Placeholder</Label>
        <Input
          id='select-placeholder'
          value={placeholder.value}
          onChange={(e) => placeholder.setValue(e.target.value)}
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='select-options'>Options</Label>
        <div className='space-y-2'>
          {options.map((option: string, index: number) => (
            <div key={index} className='flex items-center gap-2'>
              <Input
                value={option}
                onChange={(e) => handleUpdateOption(index, e.target.value)}
              />
              <Button
                type='button'
                variant='ghost'
                size='icon'
                onClick={() => handleRemoveOption(index)}
                className='text-destructive hover:text-destructive flex-shrink-0'
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          ))}
        </div>
        <div className='flex items-center gap-2 mt-2'>
          <Input
            id='new-option'
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Add new option'
          />
          <Button
            type='button'
            variant='outline'
            size='icon'
            onClick={handleAddOption}
            disabled={!newOption.trim()}
            className='flex-shrink-0'
          >
            <PlusCircle className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}
