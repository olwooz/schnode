'use client';

import { useState } from 'react';

import dynamic from 'next/dynamic';

import AppDock from '@/components/layout/AppDock';
import Canvas from '@/components/layout/Canvas';
import PanelToggle from '@/components/layout/PanelToggle';

const ComponentLibrary = dynamic(
  () => import('@/components/layout/ComponentLibrary'),
  { loading: () => <div className='p-4'>Loading component library...</div> }
);

const ConfigPanel = dynamic(() => import('@/components/layout/ConfigPanel'), {
  loading: () => <div className='p-4'>Loading configuration panel...</div>,
});

const DndProvider = dynamic(() => import('@/components/DndProvider'), {
  ssr: false,
});

const Tutorial = dynamic(() => import('@/components/layout/Tutorial'), {
  ssr: false,
});

export default function Home() {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  function closeLibraryPanel() {
    setIsLibraryOpen(false);
  }

  return (
    <DndProvider>
      <div className='flex h-screen w-full overflow-hidden bg-neutral-50 dark:bg-neutral-900 transition-theme duration-300'>
        <div
          data-library-panel
          className={`
            fixed md:relative z-20 h-full bg-background
            md:w-64 w-64 border-r shadow-sm
            transition-transform duration-300 ease-in-out
            ${
              isLibraryOpen
                ? 'translate-x-0'
                : '-translate-x-full md:translate-x-0'
            }
          `}
        >
          <ComponentLibrary closePanel={closeLibraryPanel} />
        </div>

        <div className='flex-1 flex flex-col'>
          <div className='flex items-center h-12 px-2 border-b md:hidden'>
            <PanelToggle
              isOpen={isLibraryOpen}
              onClick={() => setIsLibraryOpen(!isLibraryOpen)}
              panelName='Component Library'
            />
            <div className='flex-1 text-center font-semibold'>schnode</div>
            <PanelToggle
              isOpen={isConfigOpen}
              onClick={() => setIsConfigOpen(!isConfigOpen)}
              panelName='Configuration'
            />
          </div>
          <div className='flex-1'>
            <Canvas />
          </div>
        </div>

        <div
          data-config-panel
          className={`
            fixed md:relative right-0 z-20 h-full bg-background
            md:w-80 w-64 border-l shadow-sm
            transition-transform duration-300 ease-in-out
            ${
              isConfigOpen
                ? 'translate-x-0'
                : 'translate-x-full md:translate-x-0'
            }
          `}
        >
          <ConfigPanel />
        </div>

        {(isLibraryOpen || isConfigOpen) && (
          <div
            className='fixed inset-0 bg-black/20 z-10 md:hidden'
            onClick={() => {
              setIsLibraryOpen(false);
              setIsConfigOpen(false);
            }}
          />
        )}
      </div>
      <AppDock />
      <Tutorial />
    </DndProvider>
  );
}
