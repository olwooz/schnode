export const sampleRows = [
  {
    id: '1',
    task: 'drink coffee',
    completed: true,
  },
  {
    id: '2',
    task: 'buy groceries',
    completed: false,
  },
  {
    id: '3',
    task: 'go to the gym',
    completed: false,
  },
  {
    id: '4',
    task: 'fix bug',
    completed: false,
  },
];

export const TABLE_FILTER_FUNCTION = {
  EQUALS: 'equalsString',
  INCLUDES: 'includesString',
  INCLUDES_CASE_SENSITIVE: 'includesStringSensitive',
};

export const TABLE_SAMPLE_COLUMNS = JSON.stringify([
  {
    accessorKey: 'id',
    header: 'ID',
    filterFn: TABLE_FILTER_FUNCTION.EQUALS,
  },
  {
    accessorKey: 'task',
    header: 'Task',
    filterFn: TABLE_FILTER_FUNCTION.INCLUDES,
  },
  {
    accessorKey: 'completed',
    header: 'Completed',
    filterFn: TABLE_FILTER_FUNCTION.EQUALS,
  },
]);

export const TABLE_SAMPLE_DATA = JSON.stringify(sampleRows);

export const TABLE_DEFAULT_PAGE_SIZE = '5';
export const TABLE_SIZES = ['5', '10'];
