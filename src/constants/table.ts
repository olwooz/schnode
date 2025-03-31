export const sampleRows = [
  {
    id: '728ed52f',
    email: 'm@example.com',
    amount: 100,
    status: 'pending',
  },
  {
    id: '489e1d42',
    email: 'example@gmail.com',
    amount: 125,
    status: 'processing',
  },
  {
    id: '33c0d4fe',
    email: 'user@example.org',
    amount: 200,
    status: 'success',
  },
  {
    id: '9a47b741',
    email: 'test@example.com',
    amount: 75,
    status: 'failed',
  },
];

export const TABLE_SAMPLE_COLUMNS = JSON.stringify([
  {
    accessorKey: 'email',
    header: 'Email',
    filterFn: 'includesString',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    filterFn: 'equalsString',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    filterFn: 'includesString',
  },
]);

export const TABLE_SAMPLE_DATA = JSON.stringify(sampleRows);

export const TABLE_DEFAULT_PAGE_SIZE = '5';
export const TABLE_SIZES = ['5', '10'];
