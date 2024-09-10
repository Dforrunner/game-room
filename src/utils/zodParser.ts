import { z } from 'zod';

// Parse the request body using Zod. Handle validation errors.
export function parsedAndValidateData<T extends z.AnyZodObject>(
  data: Record<string, any>,
  schema: z.AnyZodObject
): z.infer<T> {
  const validation = schema.safeParse(data);
  if (!validation.success) {
    throw validation.error;
  }

  return validation.data as z.infer<T>;
}
