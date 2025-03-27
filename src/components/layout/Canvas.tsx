'use client';

import { useState, useRef, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { Eye, Pencil } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/components/ui/button';
import { ComponentRenderer } from '@/lib/component-renderer';
import { CanvasComponent, DragItem, ComponentType } from '@/lib/types';
import { DraggableComponent } from '@/components/draggable/DraggableComponent';
import { DRAG_ITEM_TYPE } from '@/constants/component';

const GRID_SIZE = 20;

function snapToGrid(x: number, y: number): { x: number; y: number } {
  const snappedX = Math.round(x / GRID_SIZE) * GRID_SIZE;
  const snappedY = Math.round(y / GRID_SIZE) * GRID_SIZE;
  return { x: snappedX, y: snappedY };
}

function calculatePosition(
  mouseX: number,
  mouseY: number,
  elementWidth: number,
  elementHeight: number
): { x: number; y: number } {
  const rawX = mouseX - elementWidth / 2;
  const rawY = mouseY - elementHeight / 2;

  return snapToGrid(rawX, rawY);
}

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
  const [dropPreview, setDropPreview] = useState<{
    isVisible: boolean;
    type: ComponentType | null;
    position: { x: number; y: number };
    isRelocation: boolean;
    id?: string;
  }>({
    isVisible: false,
    type: null,
    position: { x: 0, y: 0 },
    isRelocation: false,
  });

  const previewRef = useRef<HTMLDivElement | null>(null);
  const [previewSize, setPreviewSize] = useState({ width: 0, height: 0 });

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: [DRAG_ITEM_TYPE.COMPONENT, DRAG_ITEM_TYPE.PLACED_COMPONENT],
      hover: (
        item:
          | DragItem
          | {
              id: string;
              type: string;
              componentType?: ComponentType;
              initialPosition: { x: number; y: number };
            },
        monitor
      ) => {
        if (isPreviewMode) return;

        const offset = monitor.getClientOffset();
        if (!offset) return;

        const dropTargetElement = document.getElementById('canvas-drop-area');
        const dropTargetRect = dropTargetElement?.getBoundingClientRect();

        if (dropTargetRect) {
          const mouseX = offset.x - dropTargetRect.left;
          const mouseY = offset.y - dropTargetRect.top;

          const { x, y } = calculatePosition(
            mouseX,
            mouseY,
            previewSize.width,
            previewSize.height
          );

          if (item.type === DRAG_ITEM_TYPE.COMPONENT) {
            setDropPreview({
              isVisible: true,
              type: (item as DragItem).componentType,
              position: { x, y },
              isRelocation: false,
            });
          } else if (
            item.type === DRAG_ITEM_TYPE.PLACED_COMPONENT &&
            item.componentType
          ) {
            setDropPreview({
              isVisible: true,
              type: item.componentType,
              position: { x, y },
              isRelocation: true,
              id: item.id,
            });
          }
        }
      },
      drop: (
        item:
          | DragItem
          | {
              id: string;
              type: string;
              componentType?: ComponentType;
              initialPosition: { x: number; y: number };
            },
        monitor
      ) => {
        const offset = monitor.getClientOffset();

        if (offset) {
          const dropTargetElement = document.getElementById('canvas-drop-area');
          const dropTargetRect = dropTargetElement?.getBoundingClientRect();

          if (dropTargetRect) {
            const mouseX = offset.x - dropTargetRect.left;
            const mouseY = offset.y - dropTargetRect.top;

            const { x, y } = calculatePosition(
              mouseX,
              mouseY,
              previewSize.width,
              previewSize.height
            );

            if (item.type === DRAG_ITEM_TYPE.COMPONENT) {
              const newComponent: CanvasComponent = {
                id: (item as DragItem).id || uuidv4(),
                type: (item as DragItem).componentType,
                props: {},
                position: { x, y },
              };

              setDropPreview({
                isVisible: false,
                type: null,
                position: { x: 0, y: 0 },
                isRelocation: false,
              });

              onAddComponent(newComponent);
            } else if (item.type === DRAG_ITEM_TYPE.PLACED_COMPONENT) {
              setDropPreview({
                isVisible: false,
                type: null,
                position: { x: 0, y: 0 },
                isRelocation: false,
              });

              return {
                position: { x, y },
              };
            }
          }
        }
        return undefined;
      },
      collect: (monitor) => {
        const isCurrentlyOver = !!monitor.isOver();

        if (!isCurrentlyOver && dropPreview.isVisible) {
          setDropPreview({
            isVisible: false,
            type: null,
            position: { x: 0, y: 0 },
            isRelocation: false,
          });
        }

        return {
          isOver: isCurrentlyOver,
        };
      },
    }),
    [isPreviewMode, dropPreview.isVisible, previewSize]
  );

  useEffect(() => {
    if (previewRef.current && dropPreview.isVisible) {
      const { offsetWidth, offsetHeight } = previewRef.current;

      if (
        offsetWidth !== previewSize.width ||
        offsetHeight !== previewSize.height
      ) {
        setPreviewSize({
          width: offsetWidth,
          height: offsetHeight,
        });
      }
    }
  }, [
    dropPreview.isVisible,
    dropPreview.type,
    previewSize.width,
    previewSize.height,
  ]);

  function handleComponentClick(id: string) {
    if (!isPreviewMode) {
      onSelectComponent(id);
    }
  }

  function handleComponentMove(id: string, position: { x: number; y: number }) {
    if (onUpdateComponent) {
      onUpdateComponent(id, { position });
    }
  }

  const applyDropRef = (element: HTMLDivElement | null) => {
    if (element) {
      drop(element);
    }
  };

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
          ref={applyDropRef}
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
          {dropPreview.isVisible && dropPreview.type && !isPreviewMode && (
            <div
              ref={previewRef}
              className='absolute rounded border-2 border-dashed border-blue-500 bg-blue-100 p-2 z-10 pointer-events-none opacity-80'
              style={{
                left: `${dropPreview.position.x}px`,
                top: `${dropPreview.position.y}px`,
                boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
              }}
            >
              {dropPreview.type && (
                <ComponentRenderer
                  type={dropPreview.type}
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
