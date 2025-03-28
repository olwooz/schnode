import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { CanvasComponent } from '@/types/dnd';
import { ContentItem } from '@/types/card';
import { COMPONENT_TYPE } from '@/constants/component-types';
import { SELECT_DEFAULT_OPTIONS } from '@/constants/variant';

import { useCardItemArray } from './useCardItemArray';
import { UpdateComponentProps } from '@/hooks/useComponentActions';

export function useCardContent(selectedComponent: CanvasComponent) {
  const createNewContentItem = useCallback((type?: unknown) => {
    const itemType = (type as 'input' | 'select') || 'input';
    return {
      id: uuidv4(),
      type: itemType,
      props:
        itemType === COMPONENT_TYPE.INPUT
          ? { label: 'Label', placeholder: 'Placeholder', type: 'text' }
          : {
              label: 'Label',
              placeholder: 'Select an option',
              options: JSON.stringify(SELECT_DEFAULT_OPTIONS),
            },
    } as ContentItem;
  }, []);

  const {
    items: contentItems,
    handleAddItem,
    handleRemoveItem: handleRemoveContentItem,
    handleUpdateItemProp,
  } = useCardItemArray<ContentItem>(
    selectedComponent,
    'contentItems',
    createNewContentItem
  );

  const handleAddContentItem = useCallback(
    (type: 'input' | 'select') => {
      handleAddItem(type);
    },
    [handleAddItem]
  );

  const handleUpdateContentItemProp = useCallback(
    ({ id, key, value }: UpdateComponentProps) => {
      handleUpdateItemProp({ id, key: `props.${key}`, value });
    },
    [handleUpdateItemProp]
  );

  return {
    contentItems,
    handleAddContentItem,
    handleRemoveContentItem,
    handleUpdateContentItemProp,
  };
}
