import { useEffect, useState, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { CanvasComponent } from '@/types/dnd';
import { parseJsonProp } from '@/utils/canvas';
import { ContentItem } from '@/types/card';
import { COMPONENT_TYPE } from '@/constants/component';
import { SELECT_DEFAULT_OPTIONS } from '@/constants/variant';

export function useCardContent(
  selectedComponent: CanvasComponent,
  handlePropChange: (propName: string, value: string) => void
) {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const contentItemsRef = useRef<ContentItem[]>([]);
  const lastPropRef = useRef<string | null>(null);

  const debouncedUpdate = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const serialized = JSON.stringify(contentItemsRef.current);
      lastPropRef.current = serialized;
      handlePropChange('contentItems', serialized);
      timeoutRef.current = null;
    }, 300);
  }, [handlePropChange]);

  const updateItems = useCallback(
    (newItems: ContentItem[]) => {
      setContentItems(newItems);
      debouncedUpdate();
    },
    [debouncedUpdate]
  );

  const handleAddContentItem = useCallback(
    (type: 'input' | 'select') => {
      const newItem: ContentItem = {
        id: uuidv4(),
        type,
        props:
          type === COMPONENT_TYPE.INPUT
            ? { label: 'Label', placeholder: 'Placeholder', type: 'text' }
            : {
                label: 'Label',
                placeholder: 'Select an option',
                options: JSON.stringify(SELECT_DEFAULT_OPTIONS),
              },
      };

      updateItems([...contentItemsRef.current, newItem]);
    },
    [updateItems]
  );

  const handleRemoveContentItem = useCallback(
    (id: string) => {
      updateItems(contentItemsRef.current.filter((item) => item.id !== id));
    },
    [updateItems]
  );

  const handleUpdateContentItemProp = useCallback(
    (itemId: string, propName: string, propValue: string) => {
      updateItems(
        contentItemsRef.current.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              props: {
                ...item.props,
                [propName]: propValue,
              },
            };
          }
          return item;
        })
      );
    },
    [updateItems]
  );

  const createContentItemPropHandler = useCallback(
    (itemId: string) => {
      return (propName: string, value: string) => {
        handleUpdateContentItemProp(itemId, propName, value);
      };
    },
    [handleUpdateContentItemProp]
  );

  useEffect(() => {
    contentItemsRef.current = contentItems;
  }, [contentItems]);

  useEffect(() => {
    const propContentItems = selectedComponent.props.contentItems as string;

    if (propContentItems === lastPropRef.current) {
      return;
    }

    lastPropRef.current = propContentItems;

    const parsedItems = parseJsonProp(propContentItems, []);
    setContentItems(parsedItems);
  }, [selectedComponent.props.contentItems]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    contentItems,
    handleAddContentItem,
    handleRemoveContentItem,
    handleUpdateContentItemProp,
    createContentItemPropHandler,
  };
}
