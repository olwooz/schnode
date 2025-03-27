import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { ActionButton } from '@/types/card';
import { CanvasComponent } from '@/types/dnd';
import { parseJsonProp } from '@/utils/canvas';

export function useCardActionButton(
  selectedComponent: CanvasComponent,
  handlePropChange: (propName: string, value: string) => void
) {
  const [actionButtons, setActionButtons] = useState<ActionButton[]>([]);

  function handleAddActionButton() {
    const newButton: ActionButton = {
      id: uuidv4(),
      text: 'Button',
      variant: 'default',
      size: 'default',
    };

    const updatedButtons = [...actionButtons, newButton];
    setActionButtons(updatedButtons);
    handlePropChange('actionButtons', JSON.stringify(updatedButtons));
  }

  function handleRemoveActionButton(id: string) {
    const updatedButtons = actionButtons.filter((button) => button.id !== id);
    setActionButtons(updatedButtons);
    handlePropChange('actionButtons', JSON.stringify(updatedButtons));
  }

  function handleUpdateActionButtonProp(
    buttonId: string,
    propName: string,
    propValue: string
  ) {
    const updatedButtons = actionButtons.map((button) => {
      if (button.id === buttonId) {
        return {
          ...button,
          [propName]: propValue,
        };
      }
      return button;
    });

    setActionButtons(updatedButtons);
    handlePropChange('actionButtons', JSON.stringify(updatedButtons));
  }

  function createButtonPropHandler(buttonId: string) {
    return (propName: string, value: string) => {
      handleUpdateActionButtonProp(buttonId, propName, value);
    };
  }

  useEffect(() => {
    setActionButtons(
      parseJsonProp(selectedComponent.props.actionButtons as string, [])
    );
  }, [selectedComponent]);

  return {
    actionButtons,
    handleAddActionButton,
    handleRemoveActionButton,
    handleUpdateActionButtonProp,
    createButtonPropHandler,
  };
}
