import type { MaterialFileType } from "@/utils/driveUtils"

export interface MaterialVersion {
  id: string
  fileUrl: string
  fileType: MaterialFileType
  addedAt: string
  notes?: string
  uploadedBy: string
  archived?: boolean
}

export interface Material {
  id: string
  title: string
  description: string
  subject: string
  semester: string
  tags: string[]
  fileType: MaterialFileType
  fileUrl: string
  driveId?: string
  thumbnailUrl?: string | null
  uploadedBy: string
  createdAt: string
  updatedAt: string
  versions: MaterialVersion[]
  archived?: boolean
  collection?: string
}

export interface MaterialFilters {
  search: string
  subject: string | null
  semester: string | null
  types: MaterialFileType[]
  tags: string[]
  showArchived: boolean
}

export interface SemesterCollection {
  id: string
  title: string
  semester: string
  description?: string
}

export type NewMaterialInput = Omit<Material, "id" | "createdAt" | "updatedAt" | "versions" | "fileType"> & {
  fileType?: MaterialFileType
  versions?: MaterialVersion[]
}

export type NewMaterialVersionInput = Omit<MaterialVersion, "id" | "addedAt" | "fileType"> & {
  fileType?: MaterialFileType
}
