import { z } from "zod";

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string()
});

export const scheduleSchema = z.object({
  id: z.number(),
  project_id: z.number(),
  title: z.string(),
  start_date: z.string(),
  due_date: z.string(),
  sort: z.number(),
  task: z.array(taskSchema)
});

export const tagSchema = z.object({
  id: z.number(),
  name: z.string(),
  color: z.string()
});

export const projectSchema = z.object({
  id: z.number(),
  name: z.string(),
  journey_id: z.number(),
  tags: z.array(tagSchema)
});

export type ITask = z.infer<typeof taskSchema>;
export type ISchedule = z.infer<typeof scheduleSchema>;
export type ITag = z.infer<typeof tagSchema>;
export type IProject = z.infer<typeof projectSchema>;
