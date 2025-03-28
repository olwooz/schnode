'use client';

import { useState } from 'react';
import { useSetAtom } from 'jotai';

import DndProvider from '@/components/DndProvider';
import ComponentLibrary from '@/components/layout/ComponentLibrary';
import Canvas from '@/components/layout/Canvas';
import ConfigPanel from '@/components/layout/ConfigPanel';
import { selectedComponentAtom } from '@/atoms/component';

export default function Home() {
  const setSelectedComponent = useSetAtom(selectedComponentAtom);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  function togglePreviewMode() {
    setIsPreviewMode((prev) => !prev);
    setSelectedComponent(null);
  }

  return (
    <DndProvider>
      <div className='flex h-screen w-full overflow-hidden bg-neutral-50 dark:bg-neutral-900 transition-theme duration-300'>
        <div className='w-64 border-r shadow-sm'>
          <ComponentLibrary isPreviewMode={isPreviewMode} />
        </div>

        <div className='flex-1'>
          <Canvas
            isPreviewMode={isPreviewMode}
            onTogglePreviewMode={togglePreviewMode}
          />
        </div>

        <div className='w-80 border-l shadow-sm'>
          <ConfigPanel />
        </div>
      </div>
    </DndProvider>
  );
}
