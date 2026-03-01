export type Page = {
  TITLE: string
  DESCRIPTION: string
}

export type Contact = {
  TITLE: string
  DESCRIPTION: string
  NAME: string
  ICON: string
  TEXT: string
  HREF: string
}

export interface Site extends Page {
  AUTHOR: string
}

export type Links = {
  TEXT: string
  HREF: string
}[]

export type Socials = {
  NAME: string
  ICON: string
  TEXT: string
  HREF: string
}[]