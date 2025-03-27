import { useEffect, useState, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { ActionButton } from '@/types/card';
import { CanvasComponent } from '@/types/dnd';
import { parseJsonProp } from '@/utils/canvas';
import { DEFAULT_PROPS } from '@/constants/component';

export function useCardActionButton(
  selectedComponent: CanvasComponent,
  handlePropChange: (propName: string, value: string) => void
) {
  const [actionButtons, setActionButtons] = useState<ActionButton[]>([]);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const actionButtonsRef = useRef<ActionButton[]>([]);
  const lastPropRef = useRef<string | null>(null);

  const debouncedUpdate = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const serialized = JSON.stringify(actionButtonsRef.current);
      lastPropRef.current = serialized;
      handlePropChange('actionButtons', serialized);
      timeoutRef.current = null;
    }, 300);
  }, [handlePropChange]);

  const updateButtons = useCallback(
    (newButtons: ActionButton[]) => {
      setActionButtons(newButtons);
      debouncedUpdate();
    },
    [debouncedUpdate]
  );

  const handleAddActionButton = useCallback(() => {
    const newButton: ActionButton = {
      id: uuidv4(),
      ...DEFAULT_PROPS.button,
    };

    updateButtons([...actionButtonsRef.current, newButton]);
  }, [updateButtons]);

  const handleRemoveActionButton = useCallback(
    (id: string) => {
      updateButtons(
        actionButtonsRef.current.filter((button) => button.id !== id)
      );
    },
    [updateButtons]
  );

  const handleUpdateActionButtonProp = useCallback(
    (buttonId: string, propName: string, propValue: string) => {
      updateButtons(
        actionButtonsRef.current.map((button) => {
          if (button.id === buttonId) {
            return {
              ...button,
              [propName]: propValue,
            };
          }
          return button;
        })
      );
    },
    [updateButtons]
  );

  const createButtonPropHandler = useCallback(
    (buttonId: string) => {
      return (propName: string, value: string) => {
        handleUpdateActionButtonProp(buttonId, propName, value);
      };
    },
    [handleUpdateActionButtonProp]
  );

  useEffect(() => {
    actionButtonsRef.current = actionButtons;
  }, [actionButtons]);

  useEffect(() => {
    const propActionButtons = selectedComponent.props.actionButtons as string;

    if (propActionButtons === lastPropRef.current) {
      return;
    }

    lastPropRef.current = propActionButtons;

    const parsedButtons = parseJsonProp(propActionButtons, []);
    setActionButtons(parsedButtons);
  }, [selectedComponent.props.actionButtons]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    actionButtons,
    handleAddActionButton,
    handleRemoveActionButton,
    handleUpdateActionButtonProp,
    createButtonPropHandler,
  };
}
