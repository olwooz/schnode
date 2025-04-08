'use client';

import { useEffect } from 'react';

import { useAtom, useAtomValue } from 'jotai';

import { componentsAtom, selectedComponentAtom } from '@/atoms/component';
import { isPreviewModeAtom } from '@/atoms/mode';
import { DraggableComponent } from '@/components/draggable/DraggableComponent';
import { MobileNotice } from '@/components/layout/Canvas/MobileNotice';
import ComponentRenderer from '@/components/renderer/ComponentRenderer';
import { GRID_SIZE } from '@/constants/canvas';
import { useComponentActions } from '@/hooks/useComponentActions';
import { useDropPreview } from '@/hooks/useDropPreview';

export default function Canvas() {
  const isPreviewMode = useAtomValue(isPreviewModeAtom);
  const components = useAtomValue(componentsAtom);
  const [selectedComponent, setSelectedComponent] = useAtom(
    selectedComponentAtom
  );
  const { handleDeleteComponent } = useComponentActions();
  const { dropRef, previewRef, dropPreview, isOver } =
    useDropPreview(isPreviewMode);

  function getComponentProps(componentId: string) {
    const component = components.find((comp) => comp.id === componentId);
    return component?.props || {};
  }

  useEffect(() => {
    function handleDeselectComponent() {
      setSelectedComponent(null);
    }

    const canvasDropArea = dropRef.current;

    if (!canvasDropArea) {
      return;
    }

    canvasDropArea.addEventListener('click', handleDeselectComponent);

    return () => {
      canvasDropArea.removeEventListener('click', handleDeselectComponent);
    };
  }, [selectedComponent, dropRef, setSelectedComponent]);

  useEffect(() => {
    function handleDeleteWithKeyboard(e: KeyboardEvent) {
      if (e.key !== 'Delete' || !selectedComponent) {
        return;
      }

      e.stopPropagation();
      handleDeleteComponent(selectedComponent?.id);
    }

    document.addEventListener('keydown', handleDeleteWithKeyboard);

    return () =>
      document.removeEventListener('keydown', handleDeleteWithKeyboard);
  }, [selectedComponent, handleDeleteComponent]);

  return (
    <div id='canvas' className='flex h-full flex-col' data-testid='canvas'>
      <div className='flex items-center justify-between p-2 md:p-4 mb-2 md:mb-4 flex-wrap gap-2'>
        <h2
          className='text-base md:text-lg font-semibold'
          data-testid='mode-indicator'
        >
          {isPreviewMode ? 'Preview Mode' : 'Edit Mode'}
        </h2>
      </div>

      <MobileNotice />

      <div className='flex-1 overflow-auto p-2 md:p-4'>
        <div
          id='canvas-drop-area'
          ref={dropRef}
          className={`
            relative
            min-h-[calc(100vh-12rem)] 
            rounded-lg 
            ${isPreviewMode ? '' : 'border-2 border-dashed'} 
            p-2 md:p-4
            ${isOver && !isPreviewMode ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
            ${!isPreviewMode ? 'bg-grid' : ''}
            w-full
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
          data-testid='canvas-drop-area'
        >
          {dropPreview.previewComponentType && !isPreviewMode && (
            <div
              ref={previewRef}
              className='absolute rounded border-2 border-dashed border-blue-500 bg-blue-100 p-2 z-10 pointer-events-none opacity-80'
              style={{
                left: `${dropPreview.position.x}px`,
                top: `${dropPreview.position.y}px`,
                boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
                maxWidth: 'calc(100% - 2rem)',
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
              <p className='text-neutral-500 text-sm md:text-base text-center px-4'>
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
