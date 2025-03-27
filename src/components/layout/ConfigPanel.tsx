'use client';

import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function ConfigPanel() {
  return (
    <div className='flex h-full flex-col'>
      <div className='p-4'>
        <h2 className='text-lg font-semibold'>Configuration</h2>
        <p className='text-sm text-gray-500'>Customize selected component</p>
      </div>
      <Separator />
      <div className='flex-1 overflow-auto p-4'>
        <Tabs defaultValue='properties' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='properties'>Properties</TabsTrigger>
            <TabsTrigger value='styles'>Styles</TabsTrigger>
          </TabsList>
          <TabsContent value='properties' className='pt-4'>
            <div className='space-y-4'>
              <div>
                <p className='text-sm font-medium mb-2'>Select a component</p>
                <p className='text-xs text-gray-500'>
                  Click on a component in the canvas to configure its properties
                </p>
              </div>

              <div className='rounded-md border border-gray-200 p-4 text-center text-sm text-gray-500'>
                No component selected
              </div>
            </div>
          </TabsContent>
          <TabsContent value='styles' className='pt-4'>
            <div className='space-y-4'>
              <div>
                <p className='text-sm font-medium mb-2'>Component styling</p>
                <p className='text-xs text-gray-500'>
                  Customize the appearance of the selected component
                </p>
              </div>

              <div className='rounded-md border border-gray-200 p-4 text-center text-sm text-gray-500'>
                No component selected
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
