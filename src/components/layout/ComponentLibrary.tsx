'use client';

import { Separator } from '@/components/ui/separator';
import { componentLibrary } from '@/constants/component-library';

export function ComponentLibrary() {
  return (
    <div className='flex h-full flex-col'>
      <div className='p-4'>
        <h2 className='text-lg font-semibold'>Component Library</h2>
        <p className='text-sm text-gray-500'>Drag components onto the canvas</p>
      </div>
      <Separator />
      <div className='flex-1 overflow-auto p-4'>
        <div className='space-y-4'>
          {componentLibrary.map((component) => (
            <div
              key={component.id}
              className='cursor-grab rounded-md border border-gray-200 bg-white p-3 shadow-sm hover:border-gray-300 hover:shadow'
            >
              <h3 className='font-medium'>{component.name}</h3>
              <p className='text-xs text-gray-500'>{component.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
