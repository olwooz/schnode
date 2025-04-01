'use client';

import { memo } from 'react';
import { useAtomValue } from 'jotai';

import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PROPERTY_COMPONENTS } from '@/constants/component';
import StyleConfig from '@/components/layout/ConfigPanel/StyleConfig';
import { BindingConfig } from '@/components/layout/ConfigPanel/binding';
import { selectedComponentAtom } from '@/atoms/component';

function ConfigPanel() {
  const selectedComponent = useAtomValue(selectedComponentAtom);

  function renderPropertiesForm() {
    if (!selectedComponent) {
      return null;
    }

    const PropertyComponent = PROPERTY_COMPONENTS[selectedComponent.type];

    if (PropertyComponent) {
      return <PropertyComponent selectedComponent={selectedComponent} />;
    }

    return (
      <div className='rounded-md border border-gray-200 p-4 text-center text-sm text-neutral-500'>
        Properties for this component type not yet implemented
      </div>
    );
  }

  return (
    <div
      id='config-panel'
      className='flex h-full flex-col'
      data-testid='config-panel'
    >
      <div className='p-3 md:p-4 flex items-center justify-between'>
        <div>
          <h2 className='text-base md:text-lg font-semibold'>Configuration</h2>
          <p className='text-xs md:text-sm text-neutral-500'>
            {selectedComponent
              ? `Editing ${selectedComponent.type} component`
              : 'Select a component to configure'}
          </p>
        </div>
      </div>
      <Separator />
      <div className='flex-1 overflow-auto p-3 md:p-4'>
        <Tabs defaultValue='properties' className='w-full'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='properties' className='text-xs md:text-sm'>
              Properties
            </TabsTrigger>
            <TabsTrigger value='bindings' className='text-xs md:text-sm'>
              Bindings
            </TabsTrigger>
            <TabsTrigger value='styles' className='text-xs md:text-sm'>
              Styles
            </TabsTrigger>
          </TabsList>
          {selectedComponent ? (
            <>
              <TabsContent value='properties' className='pt-3 md:pt-4'>
                <div className='space-y-3 md:space-y-4'>
                  {renderPropertiesForm()}
                </div>
              </TabsContent>
              <TabsContent value='styles' className='pt-3 md:pt-4'>
                <div className='space-y-3 md:space-y-4'>
                  <StyleConfig selectedComponent={selectedComponent} />
                </div>
              </TabsContent>
              <TabsContent value='bindings' className='pt-3 md:pt-4'>
                <div className='space-y-3 md:space-y-4'>
                  <BindingConfig selectedComponent={selectedComponent} />
                </div>
              </TabsContent>
            </>
          ) : (
            <div className='rounded-md border p-3 md:p-4 text-center text-xs md:text-sm text-neutral-500 mt-3 md:mt-4'>
              No component selected
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
}

export default memo(ConfigPanel);
