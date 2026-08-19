import z from "zod";

export const schemaPlayer = z.object({
  chips: z.number().int().min(0),
});
