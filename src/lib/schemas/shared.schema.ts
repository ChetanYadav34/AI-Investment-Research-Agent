import { z } from "zod";

export const sourceSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
});
