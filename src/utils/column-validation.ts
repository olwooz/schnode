import { z } from 'zod';
import { Column } from '@/types/table';
import { TABLE_COLUMN_TYPE, TABLE_ERROR_MESSAGES } from '@/constants/table';

function getValidationSchema(column: Column) {
  const { type } = column;

  const baseSchema = {
    [TABLE_COLUMN_TYPE.STRING]: z
      .string()
      .min(1, { message: TABLE_ERROR_MESSAGES.REQUIRED }),
    [TABLE_COLUMN_TYPE.NUMBER]: z
      .string()
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
