'use client';

import { v4 as uuidv4 } from 'uuid';

import { ComponentType } from '@/types/dnd';
import { DRAG_ITEM_TYPE } from '@/constants/component-types';
import { useDraggable } from '@/hooks/useDraggable';

type DraggableItemProps = {
  type: ComponentType;
  title: string;
  description: string;
  isPreviewMode: boolean;
};

export function DraggableItem({
  type,
  title,
  description,
  isPreviewMode,
}: DraggableItemProps) {
  const { draggableRef, isDragging } = useDraggable({
    type: DRAG_ITEM_TYPE.COMPONENT,
    item: () => ({
      type: DRAG_ITEM_TYPE.COMPONENT,
      componentType: type,
      id: uuidv4(),
    }),
    isPreviewMode,
  });

  return (
    <div
      ref={draggableRef}
      className={`
        ${isPreviewMode ? 'cursor-default' : 'cursor-grab'} 
        rounded-md 
        border 
        p-3 
        shadow-sm 
        hover:shadow 
        ${isDragging ? 'opacity-0' : 'opacity-100'}
      `}
    >
      <h3 className='font-medium'>{title}</h3>
      <p className='text-xs text-neutral-500'>{description}</p>
    </div>
  );
}
