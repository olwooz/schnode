import { useEffect, useState } from 'react';
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

  useEffect(() => {
    setContentItems(
      parseJsonProp(selectedComponent.props.contentItems as string, [])
    );
  }, [selectedComponent]);

  function handleAddContentItem(type: 'input' | 'select') {
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

    const updatedItems = [...contentItems, newItem];
    setContentItems(updatedItems);
    handlePropChange('contentItems', JSON.stringify(updatedItems));
  }

  function handleRemoveContentItem(id: string) {
    const updatedItems = contentItems.filter((item) => item.id !== id);
    setContentItems(updatedItems);
    handlePropChange('contentItems', JSON.stringify(updatedItems));
  }

  function handleUpdateContentItemProp(
    itemId: string,
    propName: string,
    propValue: string
  ) {
    const updatedItems = contentItems.map((item) => {
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
    });

    setContentItems(updatedItems);
    handlePropChange('contentItems', JSON.stringify(updatedItems));
  }

  function createContentItemPropHandler(itemId: string) {
    return (propName: string, value: string) => {
      handleUpdateContentItemProp(itemId, propName, value);
    };
  }
  return {
    contentItems,
    handleAddContentItem,
    handleRemoveContentItem,
    handleUpdateContentItemProp,
    createContentItemPropHandler,
  };
}
