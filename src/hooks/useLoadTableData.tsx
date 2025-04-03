import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogFooter,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useComponentActions } from '@/hooks/useComponentActions';
import { TableRowData } from '@/types/table';
import { Column } from '@/types/table';
import { selectedComponentAtom } from '@/atoms/component';
import { TABLE_FILTER_FUNCTION } from '@/constants/table';

export function useLoadTableData(columns: Column[]) {
  const selectedComponent = useAtomValue(selectedComponentAtom);
  const { handleUpdateComponent } = useComponentActions();

  const [showColumnsDialog, setShowColumnsDialog] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingColumns, setPendingColumns] = useState<Column[]>([]);
  const [loadedData, setLoadedData] = useState<TableRowData[]>([]);

  async function handleLoadFromApi() {
    if (!selectedComponent) return;

    setIsLoading(true);
    setApiError(null);

    try {
      const apiEndpoint = selectedComponent.props.apiEndpoint;

      if (!apiEndpoint) {
        setApiError('API endpoint URL is required');
        return;
      }

      const response = await fetch(apiEndpoint);

      if (!response.ok) {
        throw new Error(`Failed to load data: ${response.statusText}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('API response must be an array of objects');
      }

      if (data.length === 0) {
        throw new Error('API returned an empty array');
      }

      const rowsWithIds = data.map((row) => ({
        id: row.id || uuidv4(),
        ...Object.fromEntries(
          Object.entries(row).map(([key, value]) => [key, String(value)])
        ),
      }));

      setLoadedData(rowsWithIds);

      const firstRow = rowsWithIds[0];
      const detectedColumns = Object.keys(firstRow).map((key) => ({
        accessorKey: key,
        header:
          key.charAt(0).toUpperCase() +
          key
            .slice(1)
            .replace(/([A-Z])/g, ' $1')
            .trim(),
        filterFn: TABLE_FILTER_FUNCTION.INCLUDES,
      }));

      if (columns.length > 0) {
        setPendingColumns(detectedColumns);
        setShowColumnsDialog(true);
      } else {
        loadColumnsAndData(detectedColumns, rowsWithIds);
      }
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : 'Failed to load data'
      );
    } finally {
      setIsLoading(false);
    }
  }

  function loadColumnsAndData(newColumns: Column[], rowsData: TableRowData[]) {
    if (!selectedComponent) return;

    handleUpdateComponent({
      id: selectedComponent.id,
      key: 'columns',
      value: JSON.stringify(newColumns),
    });

    handleUpdateComponent({
      id: selectedComponent.id,
      key: 'data',
      value: JSON.stringify(rowsData),
    });

    setShowColumnsDialog(false);
  }

  function handleCancelLoad() {
    setShowColumnsDialog(false);
  }

  const ConfirmDialog = () => {
    return (
      <Dialog open={showColumnsDialog} onOpenChange={setShowColumnsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Load Table Data</DialogTitle>
            <DialogDescription>
              The API data will override your current table data. Would you like
              to proceed?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant='outline' onClick={handleCancelLoad}>
              Cancel
            </Button>
            <Button
              onClick={() => loadColumnsAndData(pendingColumns, loadedData)}
            >
              Load Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return { ConfirmDialog, handleLoadFromApi, apiError, isLoading };
}
