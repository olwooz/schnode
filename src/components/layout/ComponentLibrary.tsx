'use client';

import { memo } from 'react';
import { useAtomValue } from 'jotai';
import { AlertCircle } from 'lucide-react';

import { Separator } from '@/components/ui/separator';
import { DraggableItem } from '@/components/draggable/DraggableItem';
import { COMPONENT_LIBRARY_ITEMS } from '@/constants/component';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { isMobileAtom } from '@/atoms/isMobile';

type ComponentLibraryProps = {
  closePanel: () => void;
};

function ComponentLibrary({ closePanel }: ComponentLibraryProps) {
  const isMobile = useAtomValue(isMobileAtom);

  return (
    <div
      className='flex h-full flex-col relative'
      data-testid='component-library'
    >
      <div className='p-3 md:p-4 flex items-center justify-between'>
        <div>
          <h2 className='text-base md:text-lg font-semibold'>
            Component Library
          </h2>
          <p className='text-xs md:text-sm text-neutral-500'>
            {isMobile
              ? 'Preview components only'
              : 'Drag components onto the canvas'}
          </p>
        </div>
      </div>
      <Separator />

      {isMobile && (
        <div className='px-3 pt-3'>
          <Alert className='relative'>
            <AlertCircle className='h-4 w-4 text-amber-500' />
            <AlertDescription className='text-xs ml-2 pr-6'>
              Component editing is disabled on mobile devices. Components can
              only be viewed.
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className='flex-1 overflow-auto p-3 md:p-4'>
        <div className='space-y-3 md:space-y-4'>
          {COMPONENT_LIBRARY_ITEMS.map((item) => (
            <DraggableItem
              key={item.type}
              type={item.type}
              title={item.title}
              description={item.description}
              closePanel={closePanel}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(ComponentLibrary);
