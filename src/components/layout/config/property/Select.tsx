import { useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CanvasComponent } from '@/types/dnd';
import { SELECT_DEFAULT_OPTIONS } from '@/constants/variant';

type SelectPropertyProps = {
  selectedComponent: CanvasComponent;
  handlePropChange: (prop: string, value: string) => void;
};

export default function SelectProperty({
  selectedComponent,
  handlePropChange,
}: SelectPropertyProps) {
  const [newOption, setNewOption] = useState('');

  const options: string[] = selectedComponent.props.options
    ? JSON.parse(selectedComponent.props.options as string)
    : SELECT_DEFAULT_OPTIONS;

  const handleAddOption = () => {
    if (!newOption.trim()) return;

    const updatedOptions = [...options, newOption.trim()];
    handlePropChange('options', JSON.stringify(updatedOptions));
    setNewOption('');
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = options.filter(
      (_: string, i: number) => i !== index
    );
    handlePropChange('options', JSON.stringify(updatedOptions));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddOption();
    }
  };

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='select-label'>Label</Label>
        <Input
          id='select-label'
          value={selectedComponent.props.label as string}
          onChange={(e) => handlePropChange('label', e.target.value)}
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='select-placeholder'>Placeholder</Label>
        <Input
          id='select-placeholder'
          value={selectedComponent.props.placeholder as string}
          onChange={(e) => handlePropChange('placeholder', e.target.value)}
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='select-options'>Options</Label>
        <div className='space-y-2'>
          {options.map((option: string, index: number) => (
            <div key={index} className='flex items-center gap-2'>
              <Input
                value={option}
                onChange={(e) => {
                  const updatedOptions = [...options];
                  updatedOptions[index] = e.target.value;
                  handlePropChange('options', JSON.stringify(updatedOptions));
                }}
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
