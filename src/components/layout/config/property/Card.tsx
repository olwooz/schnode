import { ReactNode } from 'react';
import { Trash2, Plus } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CanvasComponent } from '@/types/dnd';
import { EditorItem } from '@/types/card';
import { COMPONENT_TYPE } from '@/constants/component';
import { createMockComponent } from '@/utils/canvas';
import { useCardActionButton } from '@/hooks/useCardActionButton';
import { useCardContent } from '@/hooks/useCardContent';
import { useLocalFormState } from '@/hooks/useLocalFormState';

import InputProperty from './Input';
import SelectProperty from './Select';
import ButtonProperty from './Button';
import StyleConfig from '../StyleConfig';

type ItemEditorProps = {
  item: EditorItem;
  title: string;
  onRemove: (id: string) => void;
  children: ReactNode;
};

function ItemEditor({ item, title, onRemove, children }: ItemEditorProps) {
  return (
    <div className='border rounded-md p-3 space-y-2'>
      <div className='flex justify-between items-center mb-2'>
        <h4 className='font-medium'>{title}</h4>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          onClick={() => onRemove(item.id)}
          className='text-destructive hover:text-destructive'
        >
          <Trash2 className='h-4 w-4' />
        </Button>
      </div>
      {children}
    </div>
  );
}

type CardPropertyProps = {
  selectedComponent: CanvasComponent;
  handlePropChange: (prop: string, value: string) => void;
};

type CardPropertyComponent = React.FC<CardPropertyProps> & {
  Basic: React.FC<CardPropertyProps>;
  Content: React.FC<CardPropertyProps>;
  Action: React.FC<CardPropertyProps>;
};

const BasicProperties: React.FC<CardPropertyProps> = ({
  selectedComponent,
  handlePropChange,
}) => {
  const title = useLocalFormState(
    selectedComponent.props.title ?? '',
    (value) => handlePropChange('title', value)
  );

  const description = useLocalFormState(
    selectedComponent.props.description ?? '',
    (value) => handlePropChange('description', value)
  );

  const content = useLocalFormState(
    selectedComponent.props.content ?? '',
    (value) => handlePropChange('content', value)
  );

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='card-title'>Title</Label>
        <Input
          id='card-title'
          value={title.value}
          onChange={(e) => title.setValue(e.target.value)}
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='card-description'>Description</Label>
        <Input
          id='card-description'
          value={description.value}
          onChange={(e) => description.setValue(e.target.value)}
          placeholder='Card description text'
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='card-content'>Content Text</Label>
        <Textarea
          id='card-content'
          value={content.value}
          onChange={(e) => content.setValue(e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );
};

const ContentProperties: React.FC<CardPropertyProps> = ({
  selectedComponent,
  handlePropChange,
}) => {
  const {
    contentItems,
    handleAddContentItem,
    handleRemoveContentItem,
    createContentItemPropHandler,
  } = useCardContent(selectedComponent, handlePropChange);

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <Label>Content Components</Label>
        <div className='flex gap-2'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => handleAddContentItem('input')}
            className='flex items-center gap-1'
          >
            <Plus className='h-4 w-4' />
            <span className='sr-only md:not-sr-only md:inline'>Input</span>
          </Button>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => handleAddContentItem('select')}
            className='flex items-center gap-1'
          >
            <Plus className='h-4 w-4' />
            <span className='sr-only md:not-sr-only md:inline'>Select</span>
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
            <ItemEditor
              key={item.id}
              item={item}
              title={item.type === 'input' ? 'Input Field' : 'Select Field'}
              onRemove={handleRemoveContentItem}
            >
              {item.type === 'input' ? (
                <InputProperty
                  selectedComponent={createMockComponent(COMPONENT_TYPE.INPUT, {
                    ...item.props,
                    id: item.id,
                  })}
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
            </ItemEditor>
          ))
        )}
      </div>
    </div>
  );
};

const ActionProperties: React.FC<CardPropertyProps> = ({
  selectedComponent,
  handlePropChange,
}) => {
  const {
    actionButtons,
    handleAddActionButton,
    handleRemoveActionButton,
    createButtonPropHandler,
  } = useCardActionButton(selectedComponent, handlePropChange);

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <Label>Action Buttons</Label>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={handleAddActionButton}
          className='flex items-center gap-1'
        >
          <Plus className='h-4 w-4' />
          <span className='sr-only md:not-sr-only md:inline'>Button</span>
        </Button>
      </div>

      <div className='space-y-3'>
        {actionButtons.length === 0 ? (
          <div className='text-sm text-muted-foreground text-center p-4 border rounded-md'>
            No action buttons added yet
          </div>
        ) : (
          actionButtons.map((button) => (
            <ItemEditor
              key={button.id}
              item={button}
              title='Button'
              onRemove={handleRemoveActionButton}
            >
              <ButtonProperty
                selectedComponent={createMockComponent(COMPONENT_TYPE.BUTTON, {
                  id: button.id,
                  children: button.children,
                  variant: button.variant ?? 'default',
                  size: button.size ?? 'default',
                })}
                handlePropChange={createButtonPropHandler(button.id)}
              />

              <div className='mt-2 pt-2 border-t'>
                <StyleConfig
                  selectedComponent={createMockComponent(
                    COMPONENT_TYPE.BUTTON,
                    {
                      id: button.id,
                      variant: button.variant ?? 'default',
                      size: button.size ?? 'default',
                    }
                  )}
                  handlePropChange={createButtonPropHandler(button.id)}
                />
              </div>
            </ItemEditor>
          ))
        )}
      </div>
    </div>
  );
};

const CardProperty: CardPropertyComponent = ({
  selectedComponent,
  handlePropChange,
}) => {
  return (
    <div className='space-y-6'>
      <CardProperty.Basic
        selectedComponent={selectedComponent}
        handlePropChange={handlePropChange}
      />
      <CardProperty.Content
        selectedComponent={selectedComponent}
        handlePropChange={handlePropChange}
      />
      <CardProperty.Action
        selectedComponent={selectedComponent}
        handlePropChange={handlePropChange}
      />
    </div>
  );
};

CardProperty.Basic = BasicProperties;
CardProperty.Content = ContentProperties;
CardProperty.Action = ActionProperties;

export default CardProperty;
