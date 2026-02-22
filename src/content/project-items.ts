// Project types
type ProjectFields = {
  title: string
  description: string
  what: string
  learned: string
  why: string
}

export type ProjectContent = Record<'en' | 'vi' | 'et' | 'ru' | 'da' | 'tr' | 'zh' | 'pl' | 'fi' | 'sv' | 'tok', ProjectFields>

export type Project = {
  id: number
  content: ProjectContent
  tags: string[]
  status: "completed" | "in-progress" | "planned"
  category: "personal" | "academic" | "activism"
  hidden?: boolean
}
