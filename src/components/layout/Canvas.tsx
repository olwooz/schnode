'use client';

import { Button } from '@/components/ui/button';
import { Eye, Pencil } from 'lucide-react';

type CanvasProps = {
  isPreviewMode: boolean;
  onTogglePreviewMode: () => void;
};

export function Canvas({ isPreviewMode, onTogglePreviewMode }: CanvasProps) {
  return (
    <div className='flex h-full flex-col'>
      <div className='mb-4 flex items-center justify-between p-4'>
        <h2 className='text-lg font-semibold'>
          {isPreviewMode ? 'Preview Mode' : 'Edit Mode'}
        </h2>
        <Button onClick={onTogglePreviewMode} variant='default' size='icon'>
          {isPreviewMode ? (
            <Pencil className='h-4 w-4' />
          ) : (
            <Eye className='h-4 w-4' />
          )}
        </Button>
      </div>
      <div className='flex-1 overflow-auto p-4'>
        <div
          className={`
            min-h-[calc(100vh-12rem)] 
            rounded-lg 
            ${
              isPreviewMode
                ? 'bg-white'
                : 'border-2 border-dashed border-gray-300 bg-white'
            } 
            p-4
          `}
        >
          {isPreviewMode ? (
            <div className='flex items-center justify-center h-full'>
              <p className='text-gray-500'>Preview content will appear here</p>
            </div>
          ) : (
            <div className='flex items-center justify-center h-full'>
              <p className='text-gray-500'>
                Drag components here to build your interface
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
