import { Dispatch, SetStateAction } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useAtom } from 'jotai';

import { selectedComponentAtom } from '@/atoms/component';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useComponentActions } from '@/hooks/useComponentActions';
import { TableRowData } from '@/types/table';

type TableRowEditorProps = {
  isDialogOpen: boolean;
  setIsDialogOpen: (isDialogOpen: boolean) => void;
  data: TableRowData[];
  editedValues: TableRowData;
  setEditedValues: Dispatch<SetStateAction<TableRowData>>;
  selectedRow: TableRowData | null;
  columns: ColumnDef<TableRowData>[];
};

export function TableRowEditor({
  isDialogOpen,
  setIsDialogOpen,
  data,
  editedValues,
  setEditedValues,
  selectedRow,
  columns,
}: TableRowEditorProps) {
  const { handleUpdateComponent } = useComponentActions();
  const [selectedComponent] = useAtom(selectedComponentAtom);

  function handleInputChange(key: string, value: string) {
    setEditedValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleSave() {
    const rowIndex = data.findIndex(
      (row: TableRowData) => row.id === selectedRow?.id
    );

    if (rowIndex === -1) {
      return;
    }

    const updatedData = [...data];
    updatedData[rowIndex] = editedValues;

    const componentId = selectedComponent?.id;

    if (!componentId) {
      return;
    }

    handleUpdateComponent({
      id: componentId,
      key: 'data',
      value: JSON.stringify(updatedData),
    });

    setIsDialogOpen(false);
  }

  function getColumnAccessor(column: ColumnDef<TableRowData>): string {
    if ('accessorKey' in column) {
      return column.accessorKey as string;
    }
    if ('accessorFn' in column && column.id) {
      return column.id;
    }
    return '';
  }

  function getColumnHeader(column: ColumnDef<TableRowData>): string {
    if (typeof column.header === 'string') {
      return column.header;
    }
    if ('accessorKey' in column) {
      return column.accessorKey as string;
    }
    if (column.id) {
      return column.id;
    }
    return '';
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Row</DialogTitle>
        </DialogHeader>

        <div className='grid gap-4 py-4'>
          {selectedRow &&
            columns.map((column) => {
              const accessor = getColumnAccessor(column);
              if (!accessor) return null;

              return (
                <div
                  key={accessor}
                  className='grid grid-cols-4 items-center gap-4'
                >
                  <Label htmlFor={accessor} className='text-right'>
                    {getColumnHeader(column)}
                  </Label>
                  <Input
                    id={accessor}
                    value={String(editedValues[accessor] || '')}
                    onChange={(e) =>
                      handleInputChange(accessor, e.target.value)
                    }
                    className='col-span-3'
                  />
                </div>
              );
            })}
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
