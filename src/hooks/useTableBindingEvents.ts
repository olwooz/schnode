import { useEffect } from 'react';
import { useAtomValue } from 'jotai';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';

import { BINDING_EVENT, TABLE_ACTION } from '@/constants/binding-event';
import { useTable } from '@/hooks/useTable';
import { componentsAtom } from '@/atoms/component';

export function useTableBindingEvents(
  componentId: string | undefined,
  setColumnVisibility: React.Dispatch<React.SetStateAction<VisibilityState>>,
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>,
  setColumnSorts: React.Dispatch<React.SetStateAction<SortingState>>
) {
  const components = useAtomValue(componentsAtom);
  const tableComponent = components.filter(
    (component) => component.id === componentId
  )[0];

  const { handleAddRow, handleUpdateRow, handleDeleteRow } = useTable(
    tableComponent?.id,
    tableComponent?.props.data,
    tableComponent?.props.columns
  );

  useEffect(() => {
    const eventHandlers = {
      [BINDING_EVENT.TOGGLE_COLUMN]: (event: CustomEvent) => {
        const { id, isVisible, targetId } = event.detail;
        if (targetId !== componentId) return;

        setColumnVisibility((prev) => ({
          ...prev,
          [id]: isVisible,
        }));
      },

      [BINDING_EVENT.RESET_TABLE_VISIBILITY]: (event: CustomEvent) => {
        const { id, targetId } = event.detail;
        if (targetId !== componentId) return;

        setColumnVisibility((prev) => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
      },

      [BINDING_EVENT.FILTER_TABLE]: (event: CustomEvent) => {
        const { id, filterValue, targetId } = event.detail;
        if (targetId !== componentId) return;

        setColumnFilters((prev) => {
          const filtered = prev.filter((filter) => filter.id !== id);

          if (filterValue) {
            return [...filtered, { id, value: filterValue }];
          }

          return filtered;
        });
      },

      [BINDING_EVENT.RESET_TABLE_FILTER]: (event: CustomEvent) => {
        const { id, targetId } = event.detail;
        if (targetId !== componentId) return;

        setColumnFilters((prev) => prev.filter((filter) => filter.id !== id));
      },

      [BINDING_EVENT.SORT_TABLE]: (event: CustomEvent) => {
        const { id, desc, sort, targetId } = event.detail;
        if (targetId !== componentId) return;

        setColumnSorts((prev) => {
          const filtered = prev.filter((sort) => sort.id !== id);

          if (sort) {
            return [...filtered, { id, desc }];
          }

          return filtered;
        });
      },

      [BINDING_EVENT.RESET_TABLE_SORT]: (event: CustomEvent) => {
        const { id, targetId } = event.detail;
        if (targetId !== componentId) return;

        setColumnSorts((prev) => prev.filter((sort) => sort.id !== id));
      },

      [BINDING_EVENT.TABLE_ACTION]: (event: CustomEvent) => {
        const { sourceId, targetId, action, rowId, rowData } = event.detail;
        if (targetId !== componentId) return;

        switch (action) {
          case TABLE_ACTION.ADD:
            handleAddRow(rowData, sourceId);
            break;
          case TABLE_ACTION.UPDATE:
            handleUpdateRow(rowId, rowData, sourceId);
            break;
          case TABLE_ACTION.DELETE:
            handleDeleteRow(rowId);
            break;
        }
      },
    };

    Object.entries(eventHandlers).forEach(([event, handler]) => {
      document.addEventListener(event, handler as EventListener);
    });

    return () => {
      Object.entries(eventHandlers).forEach(([event, handler]) => {
        document.removeEventListener(event, handler as EventListener);
      });
    };
  }, [
    componentId,
    setColumnVisibility,
    setColumnFilters,
    setColumnSorts,
    handleAddRow,
    handleUpdateRow,
    handleDeleteRow,
  ]);
}
