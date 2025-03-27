'use client';

import { useState } from 'react';
import { ComponentLibrary } from '@/components/layout/ComponentLibrary';
import { Canvas } from '@/components/layout/Canvas';
import { ConfigPanel } from '@/components/layout/ConfigPanel';

export default function Home() {
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  function togglePreviewMode() {
    setIsPreviewMode((prev) => !prev);
  }

  return (
    <div className='flex h-screen w-full overflow-hidden'>
      <div className='w-64 border-r border-gray-200 bg-white shadow-sm'>
        <ComponentLibrary />
      </div>

      <div className='flex-1 bg-gray-50'>
        <Canvas
          isPreviewMode={isPreviewMode}
          onTogglePreviewMode={togglePreviewMode}
        />
      </div>

      <div className='w-80 border-l border-gray-200 bg-white shadow-sm'>
        <ConfigPanel />
      </div>
    </div>
  );
}
