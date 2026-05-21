import { z } from 'zod';

export const titleSchema = z
  .string()
  .trim()
  .min(1, 'Title is required')
  .max(200, 'Title must be under 200 characters');

export function getFieldError<T>(schema: z.ZodType<T>, value: unknown): string | null {
  const result = schema.safeParse(value);
  return result.success ? null : (result.error.issues[0]?.message ?? 'Invalid value');
}
