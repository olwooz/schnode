'use client';

import { useState } from 'react';

import DndProvider from '@/components/DndProvider';
import ComponentLibrary from '@/components/layout/ComponentLibrary';
import Canvas from '@/components/layout/Canvas';
import ConfigPanel from '@/components/layout/ConfigPanel';
import { CanvasComponent } from '@/types/dnd';

export default function Home() {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [components, setComponents] = useState<CanvasComponent[]>([]);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(
    null
  );

  function togglePreviewMode() {
    setIsPreviewMode((prev) => !prev);
    setSelectedComponentId(null);
  }

  function handleAddComponent(component: CanvasComponent) {
    setComponents((prev) => [...prev, component]);
    setSelectedComponentId(component.id);
  }

  function handleSelectComponent(id: string | null) {
    setSelectedComponentId(id);
  }

  function handleUpdateComponent(id: string, props: Record<string, string>) {
    setComponents((prev) =>
      prev.map((component) =>
        component.id === id
          ? { ...component, props: { ...component.props, ...props } }
          : component
      )
    );
  }

  function handleRepositionComponent(
    id: string,
    updates: Partial<CanvasComponent>
  ) {
    setComponents((prev) =>
      prev.map((component) =>
        component.id === id ? { ...component, ...updates } : component
      )
    );
  }

  const selectedComponent = selectedComponentId
    ? components.find((c) => c.id === selectedComponentId) || null
    : null;

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
            components={components}
            selectedComponentId={selectedComponentId}
            onSelectComponent={handleSelectComponent}
            onAddComponent={handleAddComponent}
            onUpdateComponent={handleRepositionComponent}
          />
        </div>

        <div className='w-80 border-l shadow-sm'>
          <ConfigPanel
            selectedComponent={selectedComponent}
            onUpdateComponent={handleUpdateComponent}
          />
        </div>
      </div>
    </DndProvider>
  );
}
