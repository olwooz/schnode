import { useCallback } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { DEFAULT_PROPS } from '@/constants/component';
import { ActionButton } from '@/types/card';
import { CanvasComponent } from '@/types/dnd';

import { useCardItemArray } from './useCardItemArray';

export function useCardActionButton(selectedComponent: CanvasComponent) {
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
    handleUpdateItemProp,
  } = useCardItemArray<ActionButton>(
    selectedComponent,
    'actionButtons',
    createNewActionButton
  );

  return {
    actionButtons,
    handleAddActionButton,
    handleRemoveActionButton,
    handleUpdateItemProp,
  };
}
