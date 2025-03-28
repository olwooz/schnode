'use client';

import DndProvider from '@/components/DndProvider';
import ComponentLibrary from '@/components/layout/ComponentLibrary';
import Canvas from '@/components/layout/Canvas';
import ConfigPanel from '@/components/layout/ConfigPanel';

export default function Home() {
  return (
    <DndProvider>
      <div className='flex h-screen w-full overflow-hidden bg-neutral-50 dark:bg-neutral-900 transition-theme duration-300'>
        <div className='w-64 border-r shadow-sm'>
          <ComponentLibrary />
        </div>

        <div className='flex-1'>
          <Canvas />
        </div>

        <div className='w-80 border-l shadow-sm'>
          <ConfigPanel />
        </div>
      </div>
    </DndProvider>
  );
}
