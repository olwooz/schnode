'use client';

import { Separator } from '@/components/ui/separator';

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
          <div className='cursor-grab rounded-md border border-gray-200 bg-white p-3 shadow-sm hover:border-gray-300 hover:shadow'>
            <h3 className='font-medium'>Button</h3>
            <p className='text-xs text-gray-500'>Interactive button element</p>
          </div>

          <div className='cursor-grab rounded-md border border-gray-200 bg-white p-3 shadow-sm hover:border-gray-300 hover:shadow'>
            <h3 className='font-medium'>Card</h3>
            <p className='text-xs text-gray-500'>Container for content</p>
          </div>

          <div className='cursor-grab rounded-md border border-gray-200 bg-white p-3 shadow-sm hover:border-gray-300 hover:shadow'>
            <h3 className='font-medium'>Checkbox</h3>
            <p className='text-xs text-gray-500'>Selection control</p>
          </div>

          <div className='cursor-grab rounded-md border border-gray-200 bg-white p-3 shadow-sm hover:border-gray-300 hover:shadow'>
            <h3 className='font-medium'>Input</h3>
            <p className='text-xs text-gray-500'>Text input field</p>
          </div>

          <div className='cursor-grab rounded-md border border-gray-200 bg-white p-3 shadow-sm hover:border-gray-300 hover:shadow'>
            <h3 className='font-medium'>Select</h3>
            <p className='text-xs text-gray-500'>Dropdown selection</p>
          </div>

          <div className='cursor-grab rounded-md border border-gray-200 bg-white p-3 shadow-sm hover:border-gray-300 hover:shadow'>
            <h3 className='font-medium'>Table</h3>
            <p className='text-xs text-gray-500'>Data table component</p>
          </div>
        </div>
      </div>
    </div>
  );
}
