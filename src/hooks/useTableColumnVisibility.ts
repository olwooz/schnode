import { useState, useEffect } from 'react';
import { useBindings } from '@/hooks/useBindings';
import { BindingType } from '@/types/binding';
import { isToggleColumnConfig } from '@/utils/binding';
import { ColumnDef } from '@tanstack/react-table';
import { TableRowData } from '@/types/table';

export function useTableColumnVisibility(
  tableId: string,
  columns: ColumnDef<TableRowData>[]
) {
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({});
  const { getBindingsForComponent } = useBindings();

  useEffect(() => {
    const initialVisibility: Record<string, boolean> = {};

    columns.forEach((column) => {
      const columnKey = column.id || String(Math.random());
      initialVisibility[columnKey] = true;
    });

    const bindings = getBindingsForComponent(tableId).filter(
      (binding) =>
        binding.targetId === tableId &&
        binding.type === BindingType.TOGGLE_COLUMN
    );

    bindings.forEach((binding) => {
      if (isToggleColumnConfig(binding.config)) {
        initialVisibility[binding.config.accessorKey] =
          binding.config.defaultVisible;
      }
    });

    setColumnVisibility(initialVisibility);
  }, [tableId, columns, getBindingsForComponent]);

  const toggleColumnVisibility = (accessorKey: string, isVisible: boolean) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [accessorKey]: isVisible,
    }));
  };

  return {
    columnVisibility,
    toggleColumnVisibility,
  };
}
