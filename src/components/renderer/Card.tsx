import { useEffect, useMemo, useState } from 'react';

import { useAtomValue } from 'jotai';
import { v4 as uuidv4 } from 'uuid';

import { bindingsAtom } from '@/atoms/binding';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BINDING_EVENT, TABLE_ACTION } from '@/constants/binding-event';
import { DEFAULT_PROPS } from '@/constants/component';
import { BindingType } from '@/types/binding';
import { ActionButton } from '@/types/card';
import {
  CardProps,
  ComponentRendererProps,
  ContentItem,
} from '@/types/component';

import ButtonRenderer from './Button';
import InputRenderer from './Input';
import SelectRenderer from './Select';

export default function CardRenderer({
  props,
  componentId,
}: ComponentRendererProps) {
  const cardProps = { ...DEFAULT_PROPS.card, ...props } as CardProps;
  const bindings = useAtomValue(bindingsAtom);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<string[] | null>(null);

  const contentItems = useMemo(() => {
    if (!cardProps.contentItems) return [];
    return JSON.parse(cardProps.contentItems);
  }, [cardProps.contentItems]);

  const actionButtons = cardProps.actionButtons
    ? JSON.parse(cardProps.actionButtons)
    : [];

  const cardBinding = componentId
    ? bindings.find(
        (binding) =>
          binding.sourceId === componentId &&
          binding.type === BindingType.TABLE_ACTION
      )
    : null;

  function handleInputChange(itemId: string, value: string) {
    setFormValues((prev) => ({
      ...prev,
      [itemId]: value,
    }));
  }

  function mapFormValuesToColumns(fieldMappings?: Record<string, string>) {
    if (!fieldMappings) return {};

    const mappedData: Record<string, string> = {};
    Object.entries(fieldMappings).forEach(([inputId, columnName]) => {
      if (formValues[inputId]) {
        mappedData[columnName] = formValues[inputId];
      }
    });
    return mappedData;
  }

  function handleButtonClick(button: ActionButton) {
    const action = button.action;

    if (!componentId || !cardBinding || !action) return;

    const mappedData = mapFormValuesToColumns(cardBinding.config.fieldMappings);
    const { sourceId, targetId } = cardBinding;

    const detail: Record<string, unknown> = {
      sourceId,
      targetId,
      action,
      rowId: null,
      rowData: {},
    };

    switch (action) {
      case TABLE_ACTION.ADD:
        if (!mappedData.id) {
          mappedData.id = uuidv4();
        }
        detail.rowData = mappedData;
        break;
      case TABLE_ACTION.UPDATE:
        if (!mappedData.id) {
          setErrors(['ID field is required']);
          return;
        }
        detail.rowId = mappedData.id;
        detail.rowData = mappedData;
        break;
      case TABLE_ACTION.DELETE:
        if (!mappedData.id) {
          setErrors(['ID field is required']);
          return;
        }
        detail.rowId = mappedData.id;
        break;
      default:
        return;
    }

    const event = new CustomEvent(BINDING_EVENT.TABLE_ACTION, {
      detail,
      bubbles: true,
    });
    document.dispatchEvent(event);
  }

  useEffect(() => {
    if (!cardBinding) return;

    function handleTableActionResult(event: CustomEvent) {
      const { sourceId, errors: eventErrors } = event.detail;
      if (sourceId !== componentId) return;

      setErrors(eventErrors);

      if (eventErrors) return;

      setFormValues({});
    }

    document.addEventListener(
      BINDING_EVENT.TABLE_ACTION_RESULT,
      handleTableActionResult as EventListener
    );

    return () => {
      document.removeEventListener(
        BINDING_EVENT.TABLE_ACTION_RESULT,
        handleTableActionResult as EventListener
      );
    };
  }, [cardBinding, componentId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{cardProps.title}</CardTitle>
        {cardProps.description && (
          <div className='text-sm text-muted-foreground mt-1'>
            {cardProps.description}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <p>{cardProps.content}</p>

          {contentItems.length > 0 && (
            <div className='space-y-3'>
              {contentItems.map((item: ContentItem) => (
                <div key={item.id}>
                  {item.type === 'input' ? (
                    <InputRenderer
                      props={{
                        ...item.props,
                        id: item.id,
                        value: formValues[item.id] || '',
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                          handleInputChange(item.id, e.target.value),
                      }}
                    />
                  ) : (
                    <SelectRenderer
                      props={{
                        ...item.props,
                        id: item.id,
                        value: formValues[item.id] || '',
                        onChange: (value: string) =>
                          handleInputChange(item.id, value),
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {errors && errors.length > 0 && (
            <div className='text-red-500 text-sm'>
              {errors.map((error) => (
                <div key={error}>{error}</div>
              ))}
            </div>
          )}

          {actionButtons.length > 0 && (
            <div className='flex flex-wrap gap-2 mt-4'>
              {actionButtons.map((button: ActionButton) => (
                <div key={button.id} onClick={() => handleButtonClick(button)}>
                  <ButtonRenderer props={button} />
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
