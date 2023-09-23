import { z } from "zod";

export const userInfoSchema = z.object({
  id: z.number(),
  username: z.string(),
  name: z.string(),
  email: z.string(),
  image_url: z.string(),
  role: z.string()
});

export type IUserInfo = z.infer<typeof userInfoSchema>;
