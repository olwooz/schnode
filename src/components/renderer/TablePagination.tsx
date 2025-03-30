import { Table } from '@tanstack/react-table';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';
import { TableRowData } from '@/types/table';

export function TablePagination({ table }: { table: Table<TableRowData> }) {
  const pagination = table.getState().pagination;
  const pageCount = table.getPageCount();

  const hasPreviousPage = table.getCanPreviousPage();
  const hasNextPage = table.getCanNextPage();

  function goToFirstPage() {
    table.setPageIndex(0);
  }

  function goToPreviousPage() {
    table.previousPage();
  }

  function goToNextPage() {
    table.nextPage();
  }

  function goToLastPage() {
    table.setPageIndex(pageCount - 1);
  }

  return (
    <Pagination className='flex items-center justify-end'>
      <PaginationContent>
        <PaginationItem>
          <Button
            variant='outline'
            size='icon'
            className='h-8 w-8'
            disabled={!hasPreviousPage}
            onClick={goToFirstPage}
            title='First page'
          >
            <ChevronsLeft className='h-4 w-4' />
          </Button>
        </PaginationItem>

        <PaginationItem>
          <Button
            variant='outline'
            size='icon'
            className='h-8 w-8'
            disabled={!hasPreviousPage}
            onClick={goToPreviousPage}
            title='Previous page'
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>
        </PaginationItem>

        <PaginationItem>
          <span className='px-2 text-sm'>
            Page {pagination.pageIndex + 1} of {pageCount}
          </span>
        </PaginationItem>

        <PaginationItem>
          <Button
            variant='outline'
            size='icon'
            className='h-8 w-8'
            disabled={!hasNextPage}
            onClick={goToNextPage}
            title='Next page'
          >
            <ChevronRight className='h-4 w-4' />
          </Button>
        </PaginationItem>

        <PaginationItem>
          <Button
            variant='outline'
            size='icon'
            className='h-8 w-8'
            disabled={!hasNextPage}
            onClick={goToLastPage}
            title='Last page'
          >
            <ChevronsRight className='h-4 w-4' />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
