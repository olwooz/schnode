import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Column, ColumnType, FilterFunction } from '@/types/table';
import { TABLE_COLUMN_TYPE, TABLE_FILTER_FUNCTION } from '@/constants/table';

import { TableColumnList } from './TableColumnList';

type TableColumnFormProps = {
  columns: Column[];
  handleAddColumn: (column: Column) => void;
  handleUpdateColumn: (accessorKey: string, column: Column) => void;
  handleDeleteColumn: (accessorKey: string) => void;
};

export function TableColumnForm({
  columns,
  handleAddColumn,
  handleUpdateColumn,
  handleDeleteColumn,
}: TableColumnFormProps) {
  const [newColumn, setNewColumn] = useState<Column>({
    accessorKey: '',
    header: '',
    filterFn: TABLE_FILTER_FUNCTION.INCLUDES,
    type: TABLE_COLUMN_TYPE.STRING,
    required: false,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedColumnAccessorKey, setSelectedColumnAccessorKey] = useState<
    string | null
  >(null);

  function addColumn() {
    handleAddColumn(newColumn);
    resetNewColumn();
  }

  function updateColumn() {
    if (!selectedColumnAccessorKey) {
      return;
    }

    handleUpdateColumn(selectedColumnAccessorKey, newColumn);
    setIsEditMode(false);
    setSelectedColumnAccessorKey(null);
    resetNewColumn();
  }

  function resetNewColumn() {
    setNewColumn({
      accessorKey: '',
      header: '',
      filterFn: TABLE_FILTER_FUNCTION.INCLUDES,
      type: TABLE_COLUMN_TYPE.STRING,
      required: false,
    });
  }

  function handleSelectColumn(column: Column) {
    setSelectedColumnAccessorKey(column.accessorKey);
    setNewColumn({
      accessorKey: column.accessorKey,
      header: column.header,
      filterFn: column.filterFn,
      type: column.type,
      required: column.required,
    });
    setIsEditMode(true);
  }

  function cancelEditMode() {
    setSelectedColumnAccessorKey(null);
    setIsEditMode(false);
    resetNewColumn();
  }

  return (
    <>
      <TableColumnList
        columns={columns}
        handleSelectColumn={handleSelectColumn}
        handleDeleteColumn={handleDeleteColumn}
        selectedColumnAccessorKey={selectedColumnAccessorKey}
      />
      <div className='pt-2 flex flex-col gap-4'>
        <div className='text-md font-bold'>
          {isEditMode ? 'Edit Column' : 'Add Column'}
        </div>
        <div className='space-y-2'>
          <Label htmlFor='columnKey'>Column Key</Label>
          <Input
            id='columnKey'
            value={newColumn.accessorKey ?? ''}
            onChange={(e) =>
              setNewColumn({ ...newColumn, accessorKey: e.target.value })
            }
            placeholder='e.g. firstName'
          />
        </div>

        <div className='space-y-2 mt-2'>
          <Label htmlFor='columnHeader'>Column Header</Label>
          <Input
            id='columnHeader'
            value={newColumn.header ?? ''}
            onChange={(e) =>
              setNewColumn({ ...newColumn, header: e.target.value })
            }
            placeholder='e.g. First Name'
          />
        </div>

        <div className='space-y-2 flex items-center justify-between'>
          <Label htmlFor='columnRequired'>Required</Label>
          <Switch
            id='columnRequired'
            checked={newColumn.required}
            onCheckedChange={(checked) =>
              setNewColumn({ ...newColumn, required: checked })
            }
          />
        </div>

        <div className='space-y-2 mt-2'>
          <Label htmlFor='columnType'>Column Type</Label>
          <Select
            value={newColumn.type ?? ''}
            onValueChange={(value: ColumnType) =>
              setNewColumn({ ...newColumn, type: value })
            }
          >
            <SelectTrigger id='columnType' className='w-full'>
              <SelectValue
                defaultValue={TABLE_COLUMN_TYPE.STRING}
                placeholder='Select column type'
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TABLE_COLUMN_TYPE.STRING}>String</SelectItem>
              <SelectItem value={TABLE_COLUMN_TYPE.NUMBER}>Number</SelectItem>
              <SelectItem value={TABLE_COLUMN_TYPE.BOOLEAN}>Boolean</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2 mt-2'>
          <Label htmlFor='filterFn'>Filter Function</Label>
          <Select
            value={newColumn.filterFn ?? ''}
            onValueChange={(value: FilterFunction) =>
              setNewColumn({ ...newColumn, filterFn: value })
            }
          >
            <SelectTrigger id='filterFn' className='w-full'>
              <SelectValue
                defaultValue={TABLE_FILTER_FUNCTION.INCLUDES}
                placeholder='Select filter function'
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TABLE_FILTER_FUNCTION.INCLUDES}>
                Includes
              </SelectItem>
              <SelectItem value={TABLE_FILTER_FUNCTION.INCLUDES_CASE_SENSITIVE}>
                Includes Case Sensitive
              </SelectItem>
              <SelectItem value={TABLE_FILTER_FUNCTION.EQUALS}>
                Equals
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='flex space-x-2 mt-4'>
          <Button
            onClick={isEditMode ? updateColumn : addColumn}
            className='flex-1'
          >
            {isEditMode ? 'Update Column' : 'Add Column'}
          </Button>
          {isEditMode && (
            <Button variant='outline' onClick={cancelEditMode} className='w-24'>
              Cancel
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
