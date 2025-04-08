'use client';

import { useState, useMemo } from 'react';

import { useAtomValue } from 'jotai';
import { ArrowRight, PlusCircle, Trash2 } from 'lucide-react';

import { componentsAtom } from '@/atoms/component';
import {
  ToggleColumnForm,
  FilterTableForm,
  SortTableForm,
  CardTableBindingForm,
} from '@/components/layout/ConfigPanel/binding';
import {
  Disclosure,
  DisclosureContent,
  DisclosureTrigger,
} from '@/components/motion-primitives/disclosure';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { COMPONENT_TYPE } from '@/constants/component-types';
import { useBindings } from '@/hooks/useBindings';
import { BindingType, ComponentBinding } from '@/types/binding';
import { CanvasComponent } from '@/types/dnd';
import {
  createDefaultBindingConfig,
  getCompatibleSourceComponents,
  getCompatibleTargetComponents,
} from '@/utils/binding';

const BINDING_TYPE_LABELS: Record<BindingType, string> = {
  [BindingType.TOGGLE_COLUMN]: 'Toggle Column Visibility',
  [BindingType.FILTER_TABLE]: 'Filter Table Data',
  [BindingType.SORT_TABLE]: 'Sort Table Data',
  [BindingType.TABLE_ACTION]: 'Table Actions (Add/Update/Delete)',
};

interface BindingConfigProps {
  selectedComponent: CanvasComponent;
}

export default function BindingConfig({
  selectedComponent,
}: BindingConfigProps) {
  const components = useAtomValue(componentsAtom);
  const { createBinding, deleteBinding, getBindingsForComponent } =
    useBindings();

  const [newBindingType, setNewBindingType] = useState<BindingType | ''>('');
  const [newBindingTargetId, setNewBindingTargetId] = useState<string>('');

  const componentBindings = getBindingsForComponent(selectedComponent.id);

  const isAlreadySource = componentBindings.some(
    (binding) => binding.sourceId === selectedComponent.id
  );

  const availableBindingTypes = useMemo(() => {
    return Object.values(BindingType).filter((type) => {
      const compatibleSources = getCompatibleSourceComponents(type);
      return compatibleSources.includes(selectedComponent.type);
    });
  }, [selectedComponent.type]);

  const canBeSource = availableBindingTypes.length > 0;

  const canAddBinding = canBeSource && !isAlreadySource;

  const compatibleTargets = newBindingType
    ? getCompatibleTargetComponents(newBindingType as BindingType)
    : [];

  const availableTargets = components.filter(
    (c) => c.id !== selectedComponent.id && compatibleTargets.includes(c.type)
  );

  function handleAddBinding() {
    if (!newBindingType || !newBindingTargetId) return;

    const type = newBindingType as BindingType;
    const config = createDefaultBindingConfig(type);

    createBinding(selectedComponent.id, newBindingTargetId, type, config);

    setNewBindingType('');
    setNewBindingTargetId('');
  }

  function renderAlert() {
    if (componentBindings.length > 0 || canAddBinding) {
      return;
    }

    let alertDescription = '';

    if (selectedComponent.type === COMPONENT_TYPE.TABLE) {
      alertDescription = 'No bindings configured for this component yet.';
    } else if (isAlreadySource) {
      alertDescription =
        'This component already has a binding. Each component can only be a source for one binding.';
    } else {
      alertDescription =
        'This component type cannot be used as a source for bindings.';
    }

    return (
      <Alert>
        <AlertDescription>{alertDescription}</AlertDescription>
      </Alert>
    );
  }

  function renderBindingText(binding: ComponentBinding) {
    return (
      <div className='flex items-center gap-2'>
        <span className='font-medium'>
          {binding.sourceId === selectedComponent.id
            ? 'This component'
            : components.find((c) => c.id === binding.sourceId)?.type ||
              'Unknown component'}
        </span>
        <ArrowRight className='h-4 w-4' />
        <span className='font-medium'>
          {binding.targetId === selectedComponent.id
            ? 'This component'
            : components.find((c) => c.id === binding.targetId)?.type ||
              'Unknown component'}
        </span>
      </div>
    );
  }

  function BindingFormContent({ binding }: { binding: ComponentBinding }) {
    switch (binding.type) {
      case BindingType.TOGGLE_COLUMN:
        return <ToggleColumnForm binding={binding} />;
      case BindingType.FILTER_TABLE:
        return <FilterTableForm binding={binding} />;
      case BindingType.SORT_TABLE:
        return <SortTableForm binding={binding} />;
      case BindingType.TABLE_ACTION:
        return <CardTableBindingForm binding={binding} />;
      default:
        return <div>Unknown binding type</div>;
    }
  }

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>Component Bindings</h3>
        <p className='text-sm text-muted-foreground'>
          Connect components to create interactive behaviors
        </p>
      </div>

      {renderAlert()}

      {componentBindings.length > 0 && (
        <div className='space-y-4'>
          {componentBindings.map((binding) => (
            <Disclosure
              key={binding.id}
              className='rounded-md border border-primary-200 px-3 dark:border-primary-700  '
            >
              <DisclosureTrigger>
                <button className='w-full py-2 text-left text-sm' type='button'>
                  <div className='flex items-center justify-between'>
                    {renderBindingText(binding)}
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-destructive hover:text-destructive'
                      onClick={() => deleteBinding(binding.id)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </button>
              </DisclosureTrigger>
              <DisclosureContent>
                <div className='space-y-4 pb-2'>
                  <Separator />
                  <BindingFormContent binding={binding} />
                </div>
              </DisclosureContent>
            </Disclosure>
          ))}
        </div>
      )}

      {canAddBinding && (
        <Disclosure className='rounded-md border border-primary-200 px-3 dark:border-primary-700  '>
          <DisclosureTrigger>
            <button className='w-full py-2 text-left text-sm' type='button'>
              <div className='flex items-center gap-2'>
                <PlusCircle className='h-4 w-4' />
                <span className='font-medium'>Add New Binding</span>
              </div>
            </button>
          </DisclosureTrigger>
          <DisclosureContent>
            <div className='space-y-4 pb-2'>
              <Separator />
              <div className='space-y-2'>
                <Label htmlFor='bindingType'>Binding Type</Label>
                <Select
                  value={newBindingType}
                  onValueChange={(value) => {
                    setNewBindingType(value as BindingType | '');
                    setNewBindingTargetId('');
                  }}
                >
                  <SelectTrigger id='bindingType'>
                    <SelectValue placeholder='Select binding type' />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBindingTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {BINDING_TYPE_LABELS[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {newBindingType && (
                <>
                  {availableTargets.length === 0 ? (
                    <Alert className='bg-amber-50'>
                      <AlertDescription>
                        No compatible target components found. Please add a{' '}
                        {compatibleTargets.join(' or ')} component to the canvas
                        first.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className='space-y-2'>
                      <Label htmlFor='targetComponent'>Target Component</Label>
                      <Select
                        value={newBindingTargetId}
                        onValueChange={setNewBindingTargetId}
                      >
                        <SelectTrigger id='targetComponent'>
                          <SelectValue placeholder='Select target component' />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTargets.map((component) => (
                            <SelectItem key={component.id} value={component.id}>
                              {component.type} (Name: {component.props.title})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <Button
                    className='w-full'
                    onClick={handleAddBinding}
                    disabled={!newBindingType || !newBindingTargetId}
                  >
                    <PlusCircle className='h-4 w-4 mr-2' />
                    Add Binding
                  </Button>
                </>
              )}
            </div>
          </DisclosureContent>
        </Disclosure>
      )}
    </div>
  );
}
