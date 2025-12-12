import type { NowItemContent } from "@/content/now-items"

// Serializable version of NowItem for passing to client
// (without React component references that can't be serialized)
export type SerializableNowItem = {
  id: number
  category: string
  iconName: string
  content: NowItemContent
  date: string
}

export type CategoryData = {
  name: string
  iconName: string
}
