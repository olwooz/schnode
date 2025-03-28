import { DEFAULT_PROPS } from '@/constants/component';
import { ComponentRendererProps, TableProps } from '@/types/component';

export default function TableRenderer({ props }: ComponentRendererProps) {
  const tableProps = { ...DEFAULT_PROPS.table, ...props } as TableProps;
  return (
    <div className='rounded-md border p-4'>
      <h3 className='mb-2 font-medium'>{tableProps.title}</h3>
      <p className='text-sm text-neutral-500'>Table component placeholder</p>
    </div>
  );
}
