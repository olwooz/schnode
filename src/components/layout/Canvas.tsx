'use client';

import { Eye, Pencil } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DraggableComponent } from '@/components/draggable/DraggableComponent';
import { GRID_SIZE } from '@/constants/canvas';
import { ComponentRenderer } from '@/lib/component-renderer';
import { CanvasComponent } from '@/types/dnd';
import { useDropPreview } from '@/hooks/useDropPreview';

type CanvasProps = {
  isPreviewMode: boolean;
  onTogglePreviewMode: () => void;
  components: CanvasComponent[];
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
  onAddComponent: (component: CanvasComponent) => void;
  onUpdateComponent?: (id: string, updates: Partial<CanvasComponent>) => void;
};

export function Canvas({
  isPreviewMode,
  onTogglePreviewMode,
  components,
  selectedComponentId,
  onSelectComponent,
  onAddComponent,
  onUpdateComponent,
}: CanvasProps) {
  const { dropRef, previewRef, dropPreview, isOver } = useDropPreview(
    isPreviewMode,
    onAddComponent
  );

  function handleComponentClick(id: string) {
    if (isPreviewMode) {
      return;
    }

    onSelectComponent(id);
  }

  function handleComponentMove(id: string, position: { x: number; y: number }) {
    if (!onUpdateComponent) {
      return;
    }

    onUpdateComponent(id, { position });
  }

  function getComponentProps(componentId: string) {
    const component = components.find((comp) => comp.id === componentId);
    return component?.props || {};
  }

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
          id='canvas-drop-area'
          ref={dropRef}
          className={`
            relative
            min-h-[calc(100vh-12rem)] 
            rounded-lg 
            ${
              isPreviewMode
                ? 'bg-white'
                : 'border-2 border-dashed border-gray-300 bg-white'
            } 
            p-4
            ${isOver && !isPreviewMode ? 'bg-blue-50' : ''}
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
          {dropPreview.isVisible &&
            dropPreview.previewComponentType &&
            !isPreviewMode && (
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
              <DraggableComponent
                key={component.id}
                component={component}
                isSelected={component.id === selectedComponentId}
                isPreviewMode={isPreviewMode}
                onClick={() => handleComponentClick(component.id)}
                onMove={handleComponentMove}
              />
            ))
          ) : (
            <div className='flex items-center justify-center h-full'>
              <p className='text-gray-500'>
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
