import { useEffect, useState, useRef, useCallback } from 'react';

import { CanvasComponent } from '@/types/dnd';
import {
  UpdateComponentProps,
  useComponentActions,
} from '@/hooks/useComponentActions';

export interface ItemWithId {
  id: string;
  [key: string]: unknown;
}

export function useCardItemArray<T extends ItemWithId>(
  selectedComponent: CanvasComponent,
  propName: 'contentItems' | 'actionButtons',
  createNewItem: (arg?: unknown) => T
) {
  const { handleUpdateComponent } = useComponentActions();
  const [items, setItems] = useState<T[]>([]);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const itemsRef = useRef<T[]>([]);
  const lastPropRef = useRef<string | null>(null);

  const debouncedUpdate = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const serialized = JSON.stringify(itemsRef.current);
      lastPropRef.current = serialized;
      handleUpdateComponent({
        id: selectedComponent.id,
        key: propName,
        value: serialized,
      });
      timeoutRef.current = null;
    }, 300);
  }, [handleUpdateComponent, selectedComponent.id, propName]);

  const updateItems = useCallback(
    (newItems: T[]) => {
      setItems(newItems);
      debouncedUpdate();
    },
    [debouncedUpdate]
  );

  const handleAddItem = useCallback(
    (arg?: unknown) => {
      const newItem = createNewItem(arg);
      const newItemsArray = Array.from(itemsRef.current);
      newItemsArray.push(newItem);
      updateItems(newItemsArray);
    },
    [createNewItem, updateItems]
  );

  const handleRemoveItem = useCallback(
    (id: string) => {
      updateItems(itemsRef.current.filter((item) => item.id !== id));
    },
    [updateItems]
  );

  const handleUpdateItemProp = useCallback(
    ({ id, key, value }: UpdateComponentProps) => {
      updateItems(
        itemsRef.current.map((item) => {
          if (item.id !== id) return item;

          const isNestedProp = key.includes('.');

          if (isNestedProp) {
            const [objName, propName] = key.split('.');
            const objValue = (item[objName] as Record<string, unknown>) || {};
            return {
              ...item,
              [objName]: {
                ...objValue,
                [propName]: value,
              },
            } as T;
          }

          return {
            ...item,
            [key]: value,
          } as T;
        })
      );
    },
    [updateItems]
  );

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    const propValue = selectedComponent.props[propName] as string;

    if (propValue === lastPropRef.current) {
      return;
    }

    lastPropRef.current = propValue;

    try {
      const parsedItems = propValue ? JSON.parse(propValue) : [];
      setItems(Array.isArray(parsedItems) ? parsedItems : []);
    } catch {
      setItems([]);
    }
  }, [selectedComponent.props, propName]);

  useEffect(() => {
    return () => {
      if (!timeoutRef.current) {
        return;
      }

      clearTimeout(timeoutRef.current);
    };
  }, []);

  return {
    items,
    handleAddItem,
    handleRemoveItem,
    handleUpdateItemProp,
  };
}
