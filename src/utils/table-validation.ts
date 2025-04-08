import { z } from 'zod';

import {
  RESERVED_COLUMN_KEYS,
  TABLE_COLUMN_TYPE,
  TABLE_ERROR_MESSAGES,
} from '@/constants/table';
import { Column } from '@/types/table';

function getValidationSchema(column: Column) {
  const { type } = column;

  const baseSchema = {
    [TABLE_COLUMN_TYPE.STRING]: z
      .string({ required_error: TABLE_ERROR_MESSAGES.REQUIRED })
      .min(1, { message: TABLE_ERROR_MESSAGES.REQUIRED }),
    [TABLE_COLUMN_TYPE.NUMBER]: z
      .string({ required_error: TABLE_ERROR_MESSAGES.REQUIRED })
      .min(1, { message: TABLE_ERROR_MESSAGES.REQUIRED })
      .regex(/^\d+$/, { message: TABLE_ERROR_MESSAGES.INVALID_NUMBER }),
    [TABLE_COLUMN_TYPE.BOOLEAN]: z.enum(['true', 'false'], {
      message: TABLE_ERROR_MESSAGES.INVALID_BOOLEAN,
    }),
  };

  return baseSchema[type];
}

export function validateRowData(
  columns: Column[],
  data: Record<string, string>
) {
  const dataSchema = z.object(
    Object.fromEntries(
      columns
        .filter(
          ({ accessorKey, required }) =>
            required || Object.hasOwn(data, accessorKey)
        )
        .map((column) => [column.accessorKey, getValidationSchema(column)])
    )
  );

  return dataSchema.safeParse(data);
}

export function validateColumnKey(key: string, columns: Column[]) {
  const columnKeySchema = z
    .string()
    .min(1, { message: TABLE_ERROR_MESSAGES.REQUIRED })
    .regex(/^[a-zA-Z0-9_]+$/, { message: TABLE_ERROR_MESSAGES.INVALID_KEY })
    .refine((key) => !RESERVED_COLUMN_KEYS.includes(key), {
      message: TABLE_ERROR_MESSAGES.RESERVED_KEY,
    })
    .refine((key) => !columns.some((col) => col.accessorKey === key), {
      message: TABLE_ERROR_MESSAGES.DUPLICATE_KEY,
    });

  return columnKeySchema.safeParse(key);
}

export function validateColumnHeader(header: string, columns: Column[]) {
  const columnHeaderSchema = z
    .string()
    .min(1, { message: TABLE_ERROR_MESSAGES.REQUIRED })
    .refine((header) => !columns.some((col) => col.header === header), {
      message: TABLE_ERROR_MESSAGES.DUPLICATE_HEADER,
    });

  return columnHeaderSchema.safeParse(header);
}
