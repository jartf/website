// Serializable types for Uses page data (without React components)

export type SerializableUsesItem = {
  name: string
  descriptionKey?: string
  description?: string
  link?: string
}

export type SerializableSubsection = {
  title: string
  iconName?: string
  items: SerializableUsesItem[]
}

export type SerializableUsesCategory = {
  title: string
  iconName: string
  items: SerializableUsesItem[]
  subsections?: SerializableSubsection[]
}
