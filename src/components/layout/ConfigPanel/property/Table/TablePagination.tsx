import { SelectItem } from '@/components/ui/select';

import { TABLE_SIZES } from '@/constants/table';

import { SelectContent } from '@/components/ui/select';

import { SelectValue } from '@/components/ui/select';

import { SelectTrigger } from '@/components/ui/select';

import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { TABLE_DEFAULT_PAGE_SIZE } from '@/constants/table';
import { cn } from '@/lib/utils';
import { useComponentActions } from '@/hooks/useComponentActions';
import { useAtomValue } from 'jotai';
import { selectedComponentAtom } from '@/atoms/component';

export function TablePagination() {
  const selectedComponent = useAtomValue(selectedComponentAtom);
  const { handleUpdateComponent } = useComponentActions();

  if (!selectedComponent) return null;

  return (
    <div className='space-y-4'>
      <h3 className='text-sm font-medium'>Pagination Settings</h3>

      <div className='flex items-center justify-between py-1'>
        <Label
          htmlFor='showPagination'
          className='cursor-pointer text-muted-foreground'
        >
          Show Pagination
        </Label>
        <Switch
          id='showPagination'
          checked={selectedComponent.props.showPagination === 'true'}
          onCheckedChange={(checked: boolean) =>
            handleUpdateComponent({
              id: selectedComponent.id,
              key: 'showPagination',
              value: checked.toString(),
            })
          }
        />
      </div>

      <div className='space-y-2'>
        <Label
          htmlFor='pageSize'
          className={cn({
            'text-muted-foreground':
              selectedComponent.props.showPagination !== 'true',
          })}
        >
          Rows Per Page
        </Label>
        <Select
          value={selectedComponent.props.pageSize ?? TABLE_DEFAULT_PAGE_SIZE}
          onValueChange={(value) =>
            handleUpdateComponent({
              id: selectedComponent.id,
              key: 'pageSize',
              value,
            })
          }
          disabled={selectedComponent.props.showPagination !== 'true'}
        >
          <SelectTrigger id='pageSize' className='w-full'>
            <SelectValue placeholder='Select rows per page' />
          </SelectTrigger>
          <SelectContent>
            {TABLE_SIZES.map((size) => (
              <SelectItem key={size} value={size}>
                {size} rows
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
