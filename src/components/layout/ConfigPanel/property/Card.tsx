import { ReactNode, memo } from 'react';
import { Trash2, Plus } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { COMPONENT_TYPE } from '@/constants/component-types';
import { CanvasComponent } from '@/types/dnd';
import { EditorItem, ContentItem, ActionButton } from '@/types/card';
import { createMockComponent } from '@/utils/canvas';
import { useCardActionButton } from '@/hooks/useCardActionButton';
import { useCardContent } from '@/hooks/useCardContent';
import { useLocalFormState } from '@/hooks/useLocalFormState';
import {
  useComponentActions,
  UpdateComponentProps,
} from '@/hooks/useComponentActions';

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

const ItemEditor = memo(function ItemEditor({
  item,
  title,
  onRemove,
  children,
}: ItemEditorProps) {
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
});

const ContentItemComponent = memo(function ContentItemComponent({
  item,
  onRemove,
  handleUpdateItemProp,
}: {
  item: ContentItem;
  onRemove: (id: string) => void;
  handleUpdateItemProp: ({ id, key, value }: UpdateComponentProps) => void;
}) {
  return (
    <ItemEditor
      key={item.id}
      item={item}
      title={item.type === 'input' ? 'Input Field' : 'Select Field'}
      onRemove={onRemove}
    >
      {item.type === 'input' ? (
        <InputProperty
          selectedComponent={createMockComponent(COMPONENT_TYPE.INPUT, {
            ...item.props,
            id: item.id,
          })}
          handleUpdateItemProp={handleUpdateItemProp}
        />
      ) : (
        <SelectProperty
          selectedComponent={createMockComponent(COMPONENT_TYPE.SELECT, {
            ...item.props,
            id: item.id,
          })}
          handleUpdateItemProp={handleUpdateItemProp}
        />
      )}
    </ItemEditor>
  );
});

const ActionButtonComponent = memo(function ActionButtonComponent({
  button,
  onRemove,
  handleUpdateItemProp,
}: {
  button: ActionButton;
  onRemove: (id: string) => void;
  handleUpdateItemProp: ({ id, key, value }: UpdateComponentProps) => void;
}) {
  return (
    <ItemEditor
      key={button.id}
      item={button}
      title='Button'
      onRemove={onRemove}
    >
      <ButtonProperty
        selectedComponent={createMockComponent(COMPONENT_TYPE.BUTTON, {
          id: button.id,
          children: button.children,
          variant: button.variant ?? 'default',
          size: button.size ?? 'default',
          action: button.action,
        })}
        handleUpdateItemProp={handleUpdateItemProp}
      />

      <div className='mt-2 pt-2 border-t'>
        <StyleConfig
          selectedComponent={createMockComponent(COMPONENT_TYPE.BUTTON, {
            id: button.id,
            variant: button.variant ?? 'default',
            size: button.size ?? 'default',
          })}
          handleUpdateItemProp={handleUpdateItemProp}
        />
      </div>
    </ItemEditor>
  );
});

type CardPropertyProps = {
  selectedComponent: CanvasComponent;
};

const BasicProperties = memo(function BasicProperties({
  selectedComponent,
}: CardPropertyProps) {
  const { handleUpdateComponent } = useComponentActions();
  const title = useLocalFormState(
    selectedComponent.props.title ?? '',
    (value) =>
      handleUpdateComponent({
        id: selectedComponent.id,
        key: 'title',
        value,
      })
  );

  const description = useLocalFormState(
    selectedComponent.props.description ?? '',
    (value) =>
      handleUpdateComponent({
        id: selectedComponent.id,
        key: 'description',
        value,
      })
  );

  const content = useLocalFormState(
    selectedComponent.props.content ?? '',
    (value) =>
      handleUpdateComponent({
        id: selectedComponent.id,
        key: 'content',
        value,
      })
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
});

const ContentProperties = memo(function ContentProperties({
  selectedComponent,
}: CardPropertyProps) {
  const {
    contentItems,
    handleAddContentItem,
    handleRemoveContentItem,
    handleUpdateContentItemProp,
  } = useCardContent(selectedComponent);

  const EmptyContent = memo(function EmptyContent() {
    return (
      <div className='text-sm text-muted-foreground text-center p-4 border rounded-md'>
        No content components added yet
      </div>
    );
  });

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
          <EmptyContent />
        ) : (
          contentItems.map((item) => (
            <ContentItemComponent
              key={item.id}
              item={item}
              onRemove={handleRemoveContentItem}
              handleUpdateItemProp={handleUpdateContentItemProp}
            />
          ))
        )}
      </div>
    </div>
  );
});

const ActionProperties = memo(function ActionProperties({
  selectedComponent,
}: CardPropertyProps) {
  const {
    actionButtons,
    handleAddActionButton,
    handleRemoveActionButton,
    handleUpdateItemProp,
  } = useCardActionButton(selectedComponent);

  const EmptyActions = memo(function EmptyActions() {
    return (
      <div className='text-sm text-muted-foreground text-center p-4 border rounded-md'>
        No action buttons added yet
      </div>
    );
  });

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
          <EmptyActions />
        ) : (
          actionButtons.map((button) => (
            <ActionButtonComponent
              key={button.id}
              button={button}
              onRemove={handleRemoveActionButton}
              handleUpdateItemProp={handleUpdateItemProp}
            />
          ))
        )}
      </div>
    </div>
  );
});

function CardPropertyBase({ selectedComponent }: CardPropertyProps) {
  return (
    <div className='space-y-6'>
      <BasicProperties selectedComponent={selectedComponent} />
      <ContentProperties selectedComponent={selectedComponent} />
      <ActionProperties selectedComponent={selectedComponent} />
    </div>
  );
}

const MemoizedCardProperty = memo(CardPropertyBase);

export default MemoizedCardProperty;
