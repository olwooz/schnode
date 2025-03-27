import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { CanvasComponent } from '@/types/dnd';
import { ContentItem } from '@/types/card';
import { COMPONENT_TYPE } from '@/constants/component';
import { SELECT_DEFAULT_OPTIONS } from '@/constants/variant';

import { useCardItemArray } from './useCardItemArray';

export function useCardContent(
  selectedComponent: CanvasComponent,
  handlePropChange: (propName: string, value: string) => void
) {
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
    createItemPropHandler,
  } = useCardItemArray<ContentItem>(
    selectedComponent,
    'contentItems',
    handlePropChange,
    createNewContentItem
  );

  const handleAddContentItem = useCallback(
    (type: 'input' | 'select') => {
      handleAddItem(type);
    },
    [handleAddItem]
  );

  const createContentItemPropHandler = useCallback(
    (itemId: string) => {
      return (propName: string, value: string) => {
        createItemPropHandler(itemId)(`props.${propName}`, value);
      };
    },
    [createItemPropHandler]
  );

  return {
    contentItems,
    handleAddContentItem,
    handleRemoveContentItem,
    createContentItemPropHandler,
  };
}
