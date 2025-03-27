import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { ActionButton } from '@/types/card';
import { CanvasComponent } from '@/types/dnd';
import { DEFAULT_PROPS } from '@/constants/component';
import { useCardItemArray } from './useCardItemArray';

export function useCardActionButton(
  selectedComponent: CanvasComponent,
  handlePropChange: (propName: string, value: string) => void
) {
  const createNewActionButton = useCallback(() => {
    return {
      id: uuidv4(),
      ...DEFAULT_PROPS.button,
    } as ActionButton;
  }, []);

  const {
    items: actionButtons,
    handleAddItem: handleAddActionButton,
    handleRemoveItem: handleRemoveActionButton,
    createItemPropHandler,
  } = useCardItemArray<ActionButton>(
    selectedComponent,
    'actionButtons',
    handlePropChange,
    createNewActionButton
  );

  const createButtonPropHandler = useCallback(
    (buttonId: string) => {
      return (propName: string, value: string) => {
        createItemPropHandler(buttonId)(propName, value);
      };
    },
    [createItemPropHandler]
  );

  return {
    actionButtons,
    handleAddActionButton,
    handleRemoveActionButton,
    createButtonPropHandler,
  };
}
