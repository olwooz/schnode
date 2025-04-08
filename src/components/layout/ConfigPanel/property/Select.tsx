import { useState } from 'react';

import { PlusCircle, Trash2, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SELECT_DEFAULT_OPTIONS } from '@/constants/variant';
import {
  useComponentActions,
  UpdateComponentProps,
} from '@/hooks/useComponentActions';
import { useLocalFormState } from '@/hooks/useLocalFormState';
import { CanvasComponent } from '@/types/dnd';

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
  const [errorIndex, setErrorIndex] = useState<number | null>(null);

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
    if (!value.trim()) {
      setErrorIndex(index);
      return;
    }

    setErrorIndex(null);
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
              <div className='relative flex-1'>
                <Input
                  value={option}
                  onChange={(e) => handleUpdateOption(index, e.target.value)}
                  placeholder='Option value'
                  className={errorIndex === index ? 'border-red-500 pr-10' : ''}
                />
                {errorIndex === index && (
                  <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-red-500'>
                    <AlertCircle className='h-4 w-4' />
                  </div>
                )}
              </div>
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
          {errorIndex !== null && (
            <p className='text-sm text-red-500 mt-1'>
              Option value cannot be empty
            </p>
          )}
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
            id='add-option'
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
