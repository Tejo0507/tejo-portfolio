const DRIVE_FILE_REGEX = /https?:\/\/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([\w-]+)/i
const DRIVE_PREVIEW_REGEX = /https?:\/\/drive\.google\.com\/file\/d\/([\w-]+)/i
const DRIVE_FOLDER_REGEX = /https?:\/\/drive\.google\.com\/drive\/folders\/([\w-]+)/i
const DOCS_REGEX = /https?:\/\/docs\.google\.com\/(?<docType>document|presentation|spreadsheets)\/d\/([\w-]+)/i

export type DriveLinkType = "file" | "folder" | "unknown"

export interface ParsedDriveLink {
  id?: string
  type: DriveLinkType
}

export function parseDriveLink(rawUrl: string): ParsedDriveLink {
  if (!rawUrl) return { type: "unknown" }

  const url = rawUrl.trim()
  const docMatch = url.match(DOCS_REGEX)
  if (docMatch?.[2]) {
    return { id: docMatch[2], type: "file" }
  }

  const previewMatch = url.match(DRIVE_PREVIEW_REGEX)
  if (previewMatch?.[1]) {
    return { id: previewMatch[1], type: "file" }
  }

  const directMatch = url.match(DRIVE_FILE_REGEX)
  if (directMatch?.[1]) {
    return { id: directMatch[1], type: "file" }
  }

  const folderMatch = url.match(DRIVE_FOLDER_REGEX)
  if (folderMatch?.[1]) {
    return { id: folderMatch[1], type: "folder" }
  }

  return { type: "unknown" }
}

export function getDrivePreviewUrl(id?: string | null) {
  if (!id) return ""
  return `https://drive.google.com/file/d/${id}/preview`
}

export function getDriveDownloadUrl(id?: string | null) {
  if (!id) return ""
  return `https://drive.google.com/uc?export=download&id=${id}`
}

export type MaterialFileType =
  | "pdf"
  | "ppt"
  | "doc"
  | "video"
  | "google-doc"
  | "google-slide"
  | "sheet"
  | "unknown"

export function detectFileTypeFromUrl(url: string): MaterialFileType {
  if (!url) return "unknown"
  const lower = url.toLowerCase()
  if (lower.includes("/document/d/")) return "google-doc"
  if (lower.includes("/presentation/d/")) return "google-slide"
  if (lower.includes("/spreadsheets/d/")) return "sheet"
  if (lower.endsWith(".pdf") || lower.includes("export=download&id") || lower.includes("preview")) return "pdf"
  if (lower.endsWith(".ppt") || lower.endsWith(".pptx")) return "ppt"
  if (lower.endsWith(".doc") || lower.endsWith(".docx")) return "doc"
  if (lower.endsWith(".mp4") || lower.endsWith(".mov")) return "video"
  return "unknown"
}

export async function fetchThumbnailIfPossible(id?: string | null): Promise<string | null> {
  if (!id) return null
  // NOTE: Fetching Drive thumbnails usually requires OAuth + Google Drive API (files.get with fields=thumbnailLink).
  // Recommend using a serverless function (Firebase Functions, Netlify, Vercel) that stores credentials safely
  // and exposes a tiny proxy endpoint: `/api/drive-thumbnail?id=FILE_ID&key=${process.env.GDRIVE_KEY}`.
  // This client helper simply returns null to keep everything client-only.
  return null
}

/**
 * Embedding Google Drive / Docs content only works if the asset is set to "Anyone with the link can view".
 * When files are private, the iframe preview will show a 403.
 */
export function getEmbeddableUrl(id?: string | null, fallbackUrl?: string) {
  if (id) return getDrivePreviewUrl(id)
  return fallbackUrl ?? ""
}
