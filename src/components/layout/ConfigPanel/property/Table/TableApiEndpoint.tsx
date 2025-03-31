import { useAtomValue } from 'jotai';
import { Download } from 'lucide-react';

import { selectedComponentAtom } from '@/atoms/component';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useComponentActions } from '@/hooks/useComponentActions';
import { useLoadTableData } from '@/hooks/useLoadTableData';
import { Column } from '@/types/table';

type TableApiEndpointProps = {
  columns: Column[];
};

export function TableApiEndpoint({ columns }: TableApiEndpointProps) {
  const selectedComponent = useAtomValue(selectedComponentAtom);
  const { ConfirmDialog, handleLoadFromApi, apiError, isLoading } =
    useLoadTableData(columns);
  const { handleUpdateComponent } = useComponentActions();

  if (!selectedComponent) return null;

  return (
    <div className='space-y-2'>
      <Label htmlFor='apiEndpoint'>API Endpoint</Label>
      <div className='flex space-x-2'>
        <Input
          id='apiEndpoint'
          value={selectedComponent.props.apiEndpoint ?? ''}
          onChange={(e) =>
            handleUpdateComponent({
              id: selectedComponent.id,
              key: 'apiEndpoint',
              value: e.target.value,
            })
          }
          placeholder='https://api.example.com/data'
          className='flex-1'
        />
        <Button
          onClick={handleLoadFromApi}
          disabled={isLoading}
          variant='outline'
          className='flex-shrink-0'
        >
          {isLoading ? (
            <span className='flex items-center gap-1'>
              <span className='h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent'></span>
              Loading
            </span>
          ) : (
            <span className='flex items-center gap-1'>
              <Download className='h-4 w-4' />
              Load
            </span>
          )}
        </Button>
      </div>
      {apiError && <div className='text-sm text-red-500 mt-1'>{apiError}</div>}
      <ConfirmDialog />
    </div>
  );
}
