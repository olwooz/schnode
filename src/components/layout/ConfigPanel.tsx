'use client';

import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CanvasComponent } from '@/types/dnd';
import { COMPONENT_TYPE } from '@/constants/component';
import {
  ButtonProperty,
  CardProperty,
  CheckboxProperty,
  InputProperty,
  SelectProperty,
} from '@/components/layout/config/property';
import StyleConfig from '@/components/layout/config/StyleConfig';

type ConfigPanelProps = {
  selectedComponent: CanvasComponent | null;
  onUpdateComponent?: (id: string, props: Record<string, string>) => void;
};

export function ConfigPanel({
  selectedComponent,
  onUpdateComponent,
}: ConfigPanelProps) {
  function handlePropChange(key: string, value: string) {
    if (!selectedComponent || !onUpdateComponent) {
      return;
    }

    onUpdateComponent(selectedComponent.id, {
      ...selectedComponent.props,
      [key]: value,
    });
  }

  function renderPropertiesForm() {
    if (!selectedComponent) {
      return (
        <div className='rounded-md border border-gray-200 p-4 text-center text-sm text-gray-500'>
          No component selected
        </div>
      );
    }

    switch (selectedComponent.type) {
      case COMPONENT_TYPE.BUTTON:
        return (
          <ButtonProperty
            selectedComponent={selectedComponent}
            handlePropChange={handlePropChange}
          />
        );

      case COMPONENT_TYPE.CHECKBOX:
        return (
          <CheckboxProperty
            selectedComponent={selectedComponent}
            handlePropChange={handlePropChange}
          />
        );

      case COMPONENT_TYPE.INPUT:
        return (
          <InputProperty
            selectedComponent={selectedComponent}
            handlePropChange={handlePropChange}
          />
        );

      case COMPONENT_TYPE.SELECT:
        return (
          <SelectProperty
            selectedComponent={selectedComponent}
            handlePropChange={handlePropChange}
          />
        );

      case COMPONENT_TYPE.CARD:
        return (
          <CardProperty
            selectedComponent={selectedComponent}
            handlePropChange={handlePropChange}
          />
        );

      default:
        return (
          <div className='rounded-md border border-gray-200 p-4 text-center text-sm text-gray-500'>
            Properties for this component type not yet implemented
          </div>
        );
    }
  }

  return (
    <div className='flex h-full flex-col'>
      <div className='p-4'>
        <h2 className='text-lg font-semibold'>Configuration</h2>
        <p className='text-sm text-gray-500'>
          {selectedComponent
            ? `Editing ${selectedComponent.type} component`
            : 'Select a component to configure'}
        </p>
      </div>
      <Separator />
      <div className='flex-1 overflow-auto p-4'>
        <Tabs defaultValue='properties' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='properties'>Properties</TabsTrigger>
            <TabsTrigger value='styles'>Styles</TabsTrigger>
          </TabsList>
          <TabsContent value='properties' className='pt-4'>
            <div className='space-y-4'>{renderPropertiesForm()}</div>
          </TabsContent>
          <TabsContent value='styles' className='pt-4'>
            <div className='space-y-4'>
              {selectedComponent && (
                <StyleConfig
                  selectedComponent={selectedComponent}
                  handlePropChange={handlePropChange}
                />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
