'use client';

import { Separator } from '@/components/ui/separator';
import { DraggableItem } from '@/components/draggable/DraggableItem';
import { COMPONENT_LIBRARY_ITEMS } from '@/constants/component';
import { memo } from 'react';

type ComponentLibraryProps = {
  isPreviewMode: boolean;
};

function ComponentLibrary({ isPreviewMode }: ComponentLibraryProps) {
  return (
    <div className='flex h-full flex-col'>
      <div className='p-4'>
        <h2 className='text-lg font-semibold'>Component Library</h2>
        <p className='text-sm text-neutral-500'>
          Drag components onto the canvas
        </p>
      </div>
      <Separator />
      <div className='flex-1 overflow-auto p-4'>
        <div className='space-y-4'>
          {COMPONENT_LIBRARY_ITEMS.map((item) => (
            <DraggableItem
              key={item.type}
              type={item.type}
              title={item.title}
              description={item.description}
              isPreviewMode={isPreviewMode}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(ComponentLibrary);
