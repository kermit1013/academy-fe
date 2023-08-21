import { z } from "zod";

export const Tag = z.object({
  id: z.number(),
  name: z.string(),
  color: z.string()
});

export const journeySchema = z.object({
  id: z.number(),
  name: z.string(),
  user_id: z.number(),
  planTag: z.string(),
  tags: z.array(Tag),
  created_date: z.string(),
  created_by: z.string(),
  last_modified_date: z.string(),
  last_modified_by: z.string()
});

export type IJourney = z.infer<typeof journeySchema>;
export type ITag = z.infer<typeof Tag>;
