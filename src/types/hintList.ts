import { z } from 'zod'

export const itemSchema = z.object({
  id: z.number(),
  name: z.string(),
  source: z.number(),
  isSelected: z.boolean(),
})

const typeSchema = z.object({
  id: z.number(),
  title: z.string(),
  list: z.array(itemSchema),
})

const res = z.object({
  list_id: z.number(),
  item_id: z.number(),
  list_title: z.string(),
  item_name: z.string(),
})

const hintListSchema = z.array(typeSchema)

export type IHintList = z.infer<typeof hintListSchema>
export type IItem = z.infer<typeof itemSchema>

export type IResponse = z.infer<typeof res>
