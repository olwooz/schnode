import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CanvasComponent, ComponentType } from '@/types/dnd';
import InputProperty from './Input';
import SelectProperty from './Select';
import ButtonProperty from './Button';
import StyleConfig from '../StyleConfig';
import { COMPONENT_TYPE } from '@/constants/component';
import { SELECT_DEFAULT_OPTIONS } from '@/constants/variant';

type ContentItem = {
  id: string;
  type: 'input' | 'select';
  props: Record<string, string>;
};

type ActionButton = {
  id: string;
  text: string;
  variant: string;
  size: string;
};

function createMockComponent(
  type: string,
  props: Record<string, string>
): CanvasComponent {
  return {
    id: props.id || 'mock-id',
    type: type as ComponentType,
    props,
    position: { x: 0, y: 0 },
  };
}

type CardPropertyProps = {
  selectedComponent: CanvasComponent;
  handlePropChange: (prop: string, value: string) => void;
};

export default function CardProperty({
  selectedComponent,
  handlePropChange,
}: CardPropertyProps) {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [actionButtons, setActionButtons] = useState<ActionButton[]>([]);

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

  function createContentItemPropHandler(itemId: string) {
    return (propName: string, value: string) => {
      handleUpdateContentItemProp(itemId, propName, value);
    };
  }

  function createButtonPropHandler(buttonId: string) {
    return (propName: string, value: string) => {
      handleUpdateActionButtonProp(buttonId, propName, value);
    };
  }

  useEffect(() => {
    try {
      const newContentItems = selectedComponent.props.contentItems
        ? JSON.parse(selectedComponent.props.contentItems as string)
        : [];
      setContentItems(newContentItems);
    } catch {
      setContentItems([]);
    }

    try {
      const newActionButtons = selectedComponent.props.actionButtons
        ? JSON.parse(selectedComponent.props.actionButtons as string)
        : [];
      setActionButtons(newActionButtons);
    } catch {
      setActionButtons([]);
    }
  }, [selectedComponent]);

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='card-title'>Title</Label>
          <Input
            id='card-title'
            value={selectedComponent.props.title ?? ''}
            onChange={(e) => handlePropChange('title', e.target.value)}
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='card-description'>Description</Label>
          <Input
            id='card-description'
            value={selectedComponent.props.description ?? ''}
            onChange={(e) => handlePropChange('description', e.target.value)}
            placeholder='Card description text'
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='card-content'>Content Text</Label>
          <Textarea
            id='card-content'
            value={selectedComponent.props.content ?? ''}
            onChange={(e) => handlePropChange('content', e.target.value)}
            rows={3}
          />
        </div>
      </div>

      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <Label>Content Components</Label>
          <div className='flex gap-2'>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() => handleAddContentItem('input')}
            >
              Add Input
            </Button>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() => handleAddContentItem('select')}
            >
              Add Select
            </Button>
          </div>
        </div>

        <div className='space-y-3'>
          {contentItems.length === 0 ? (
            <div className='text-sm text-muted-foreground text-center p-4 border rounded-md'>
              No content components added yet
            </div>
          ) : (
            contentItems.map((item) => (
              <div key={item.id} className='border rounded-md p-3 space-y-2'>
                <div className='flex justify-between items-center mb-2'>
                  <h4 className='font-medium'>
                    {item.type === 'input' ? 'Input Field' : 'Select Field'}
                  </h4>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    onClick={() => handleRemoveContentItem(item.id)}
                    className='text-destructive hover:text-destructive'
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>

                {item.type === 'input' ? (
                  <InputProperty
                    selectedComponent={createMockComponent(
                      COMPONENT_TYPE.INPUT,
                      { ...item.props, id: item.id }
                    )}
                    handlePropChange={createContentItemPropHandler(item.id)}
                  />
                ) : (
                  <SelectProperty
                    selectedComponent={createMockComponent(
                      COMPONENT_TYPE.SELECT,
                      { ...item.props, id: item.id }
                    )}
                    handlePropChange={createContentItemPropHandler(item.id)}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <Label>Action Buttons</Label>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={handleAddActionButton}
          >
            Add Button
          </Button>
        </div>

        <div className='space-y-3'>
          {actionButtons.length === 0 ? (
            <div className='text-sm text-muted-foreground text-center p-4 border rounded-md'>
              No action buttons added yet
            </div>
          ) : (
            actionButtons.map((button) => (
              <div key={button.id} className='border rounded-md p-3 space-y-2'>
                <div className='flex justify-between items-center mb-2'>
                  <h4 className='font-medium'>Button</h4>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    onClick={() => handleRemoveActionButton(button.id)}
                    className='text-destructive hover:text-destructive'
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>

                <ButtonProperty
                  selectedComponent={createMockComponent(
                    COMPONENT_TYPE.BUTTON,
                    {
                      id: button.id,
                      children: button.text,
                      variant: button.variant,
                      size: button.size,
                    }
                  )}
                  handlePropChange={(prop, value) => {
                    if (prop === 'children') {
                      handleUpdateActionButtonProp(button.id, 'text', value);
                    } else {
                      handleUpdateActionButtonProp(button.id, prop, value);
                    }
                  }}
                />

                <div className='mt-2 pt-2 border-t'>
                  <StyleConfig
                    selectedComponent={createMockComponent(
                      COMPONENT_TYPE.BUTTON,
                      {
                        id: button.id,
                        variant: button.variant,
                        size: button.size,
                      }
                    )}
                    handlePropChange={createButtonPropHandler(button.id)}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
