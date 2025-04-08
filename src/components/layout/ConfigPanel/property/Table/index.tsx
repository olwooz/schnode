'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PropertyComponentProps } from '@/types/component';
import { useTable } from '@/hooks/useTable';
import { useComponentActions } from '@/hooks/useComponentActions';
import { useLocalFormState } from '@/hooks/useLocalFormState';

import { TableColumnForm } from './TableColumnForm';
import { TableRowForm } from './TableRowForm';
import { TablePagination } from './TablePagination';
import { TableApiEndpoint } from './TableApiEndpoint';

export default function TableProperty({
  selectedComponent,
}: PropertyComponentProps) {
  const { handleUpdateComponent } = useComponentActions();
  const {
    columns,
    handleAddRow,
    handleAddColumn,
    handleDeleteColumn,
    handleUpdateColumn,
  } = useTable(
    selectedComponent.id,
    selectedComponent.props.data,
    selectedComponent.props.columns
  );

  const title = useLocalFormState(
    selectedComponent.props.title ?? '',
    (value) =>
      handleUpdateComponent({
        id: selectedComponent.id,
        key: 'title',
        value,
      })
  );

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='title'>Table Title</Label>
        <Input
          id='title'
          value={title.value}
          onChange={(e) => title.setValue(e.target.value)}
          placeholder='Enter table title'
        />
      </div>

      <TableApiEndpoint columns={columns} />
      <TablePagination />
      <Tabs defaultValue='columns' className='w-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='columns'>Columns</TabsTrigger>
          <TabsTrigger value='rows'>Rows</TabsTrigger>
        </TabsList>
        <TabsContent value='columns' className='space-y-4 pt-4'>
          <TableColumnForm
            columns={columns}
            handleAddColumn={handleAddColumn}
            handleUpdateColumn={handleUpdateColumn}
            handleDeleteColumn={handleDeleteColumn}
          />
        </TabsContent>
        <TabsContent value='rows' className='space-y-4 pt-4'>
          <TableRowForm columns={columns} handleAddRow={handleAddRow} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
