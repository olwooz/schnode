'use client';

import { v4 as uuidv4 } from 'uuid';

import { ComponentType } from '@/types/dnd';
import { DRAG_ITEM_TYPE } from '@/constants/component';
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
        cursor-${isPreviewMode ? 'default' : 'grab'} 
        rounded-md 
        border 
        border-gray-200 
        bg-white 
        p-3 
        shadow-sm 
        hover:border-gray-300 
        hover:shadow 
        transition-all duration-200
        ${isDragging ? 'opacity-0' : 'opacity-100'}
      `}
    >
      <h3 className='font-medium'>{title}</h3>
      <p className='text-xs text-gray-500'>{description}</p>
    </div>
  );
}
