'use client';

import { useAtomValue } from 'jotai';

import ComponentRenderer from '@/components/renderer/ComponentRenderer';
import { DraggableComponent } from '@/components/draggable/DraggableComponent';
import { PreviewToggle } from '@/components/ui/preview-toggle';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LayoutIO } from '@/components/layout/LayoutIO';
import { GRID_SIZE } from '@/constants/canvas';
import { useDropPreview } from '@/hooks/useDropPreview';
import { componentsAtom } from '@/atoms/component';
import { isPreviewModeAtom } from '@/atoms/mode';

export default function Canvas() {
  const isPreviewMode = useAtomValue(isPreviewModeAtom);
  const components = useAtomValue(componentsAtom);
  const { dropRef, previewRef, dropPreview, isOver } =
    useDropPreview(isPreviewMode);

  function getComponentProps(componentId: string) {
    const component = components.find((comp) => comp.id === componentId);
    return component?.props || {};
  }

  return (
    <div className='flex h-full flex-col' data-testid='canvas'>
      <div className='mb-4 flex items-center justify-between p-4'>
        <h2 className='text-lg font-semibold' data-testid='mode-indicator'>
          {isPreviewMode ? 'Preview Mode' : 'Edit Mode'}
        </h2>
        <div className='flex items-center gap-2'>
          <LayoutIO />
          <ThemeToggle />
          <PreviewToggle />
        </div>
      </div>
      <div className='flex-1 overflow-auto p-4'>
        <div
          id='canvas-drop-area'
          ref={dropRef}
          className={`
            relative
            min-h-[calc(100vh-12rem)] 
            rounded-lg 
            ${isPreviewMode ? '' : 'border-2 border-dashed'} 
            p-4
            ${isOver && !isPreviewMode ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
            ${!isPreviewMode ? 'bg-grid' : ''}
          `}
          style={
            !isPreviewMode
              ? {
                  backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
                  backgroundImage:
                    'radial-gradient(circle, #0000000a 1px, transparent 1px)',
                }
              : undefined
          }
        >
          {dropPreview.previewComponentType && !isPreviewMode && (
            <div
              ref={previewRef}
              className='absolute rounded border-2 border-dashed border-blue-500 bg-blue-100 p-2 z-10 pointer-events-none opacity-80'
              style={{
                left: `${dropPreview.position.x}px`,
                top: `${dropPreview.position.y}px`,
                boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
              }}
            >
              {dropPreview.previewComponentType && (
                <ComponentRenderer
                  type={dropPreview.previewComponentType}
                  props={
                    dropPreview.isRelocation && dropPreview.id
                      ? getComponentProps(dropPreview.id)
                      : {}
                  }
                />
              )}
            </div>
          )}

          {components.length > 0 ? (
            components.map((component) => (
              <DraggableComponent key={component.id} component={component} />
            ))
          ) : (
            <div className='flex items-center justify-center h-full'>
              <p className='text-neutral-500'>
                {isPreviewMode
                  ? 'No components to preview'
                  : 'Drag components here to build your interface'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
