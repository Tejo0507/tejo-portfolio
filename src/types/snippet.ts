export type LanguageId =
  | "typescript"
  | "javascript"
  | "python"
  | "java"
  | "sql"
  | "css"
  | "bash"
  | "go"
  | "rust"
  | "other"

export interface SnippetVersion {
  id: string
  code: string
  createdAt: string
  note?: string
}

export interface Snippet {
  id: string
  title: string
  language: LanguageId
  tags: string[]
  description: string
  code: string
  createdAt: string
  updatedAt: string
  author: string
  versions: SnippetVersion[]
  folderId: string | null
  favorite?: boolean
}

export interface FolderNode {
  id: string
  name: string
  parentId: string | null
}

export interface SnippetFilters {
  language: LanguageId | "all"
  tags: string[]
  sort: "recent" | "popular"
}
