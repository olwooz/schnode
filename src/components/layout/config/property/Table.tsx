'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PropertyComponentProps } from '@/types/component';

export default function TableProperty({
  selectedComponent,
  handlePropChange,
}: PropertyComponentProps) {
  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='title'>Table Title</Label>
        <Input
          id='title'
          value={selectedComponent.props.title || ''}
          onChange={(e) => handlePropChange('title', e.target.value)}
          placeholder='Enter table title'
        />
      </div>
    </div>
  );
}
