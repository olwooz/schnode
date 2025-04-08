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
} as const;

export const TABLE_COLUMN_TYPE = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
} as const;

export const TABLE_SAMPLE_COLUMNS = JSON.stringify([
  {
    accessorKey: 'id',
    header: 'ID',
    filterFn: TABLE_FILTER_FUNCTION.EQUALS,
    type: TABLE_COLUMN_TYPE.STRING,
    required: true,
  },
  {
    accessorKey: 'task',
    header: 'Task',
    filterFn: TABLE_FILTER_FUNCTION.INCLUDES,
    type: TABLE_COLUMN_TYPE.STRING,
    required: true,
  },
  {
    accessorKey: 'completed',
    header: 'Completed',
    filterFn: TABLE_FILTER_FUNCTION.EQUALS,
    type: TABLE_COLUMN_TYPE.BOOLEAN,
    required: true,
  },
]);

export const TABLE_SAMPLE_DATA = JSON.stringify(sampleRows);

export const TABLE_DEFAULT_PAGE_SIZE = '5';
export const TABLE_SIZES = ['5', '10'];

export const RESERVED_COLUMN_KEYS = ['__proto__', 'constructor', 'prototype'];

export const TABLE_ERROR_MESSAGES = {
  REQUIRED: 'This field is required.',
  INVALID_NUMBER: 'Please enter a valid number.',
  INVALID_BOOLEAN: 'Please enter either "true" or "false".',
  RESERVED_KEY: 'This key is reserved for internal use.',
  INVALID_KEY: 'Only letters, numbers, and underscores are allowed.',
  DUPLICATE_KEY: 'A column with this key already exists.',
  DUPLICATE_HEADER: 'A column with this header already exists.',
} as const;
