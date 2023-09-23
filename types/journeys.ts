import { z } from "zod";

export const bubbleSchema = z.object({
  id: z.number(),
  name: z.string(),
  position_x: z.number(),
  position_y: z.number(),
  cluster_code: z.string()
});

export const clusterNodeSchema = z.object({
  id: z.number(),
  cluster_code: z.string(),
  name: z.string(),
  is_solid: z.boolean()
});

export const topicSchema = z.object({
  id: z.number(),
  name: z.string(),
  motivation: z.number(),
  focus: z.number(),
  difficulty: z.number()
});

export const journeySchema = z.record(z.any()).and(
  z.object({
    id: z.number(),
    bubbles: z.array(bubbleSchema),
    cluster_nodes: z.array(clusterNodeSchema),
    topics: z.array(topicSchema)
  })
);

export type IBubble = z.infer<typeof bubbleSchema>;
export type IClusterNode = z.infer<typeof clusterNodeSchema>;
export type ITopic = z.infer<typeof topicSchema>;
export type IJourney = z.infer<typeof journeySchema>;
