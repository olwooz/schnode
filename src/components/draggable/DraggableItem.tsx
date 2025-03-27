'use client';

import { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { v4 as uuidv4 } from 'uuid';

import { ComponentType } from '@/lib/types';
import { DRAG_ITEM_TYPE } from '@/constants/component';

type DraggableItemProps = {
  type: ComponentType;
  title: string;
  description: string;
};

export function DraggableItem({
  type,
  title,
  description,
}: DraggableItemProps) {
  const [{ isDragging }, drag, preview] = useDrag({
    type: DRAG_ITEM_TYPE.COMPONENT,
    item: () => ({
      type: DRAG_ITEM_TYPE.COMPONENT,
      componentType: type,
      id: uuidv4(),
    }),
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  const applyDragRef = (element: HTMLDivElement | null) => {
    if (!element) {
      return;
    }
    drag(element);
  };

  return (
    <div
      ref={applyDragRef}
      className={`
        cursor-grab 
        rounded-md 
        border 
        border-gray-200 
        bg-white 
        p-3 
        shadow-sm 
        hover:border-gray-300 
        hover:shadow 
        transition-all duration-200
        ${isDragging ? 'opacity-30' : 'opacity-100'}
      `}
    >
      <h3 className='font-medium'>{title}</h3>
      <p className='text-xs text-gray-500'>{description}</p>
    </div>
  );
}
