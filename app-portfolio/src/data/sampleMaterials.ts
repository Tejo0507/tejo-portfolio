import type { Material } from "@/types/materials"
import { detectFileTypeFromUrl, parseDriveLink } from "@/utils/driveUtils"

function buildMaterial(partial: Omit<Material, "id" | "createdAt" | "updatedAt" | "versions"> & { versions?: Material["versions"] }): Material {
  const driveMeta = parseDriveLink(partial.fileUrl)
  const now = new Date().toISOString()
  const versions = partial.versions ?? [
    {
      id: `${partial.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-v1`,
      fileUrl: partial.fileUrl,
      fileType: partial.fileType,
      addedAt: now,
      uploadedBy: partial.uploadedBy,
    },
  ]

  return {
    id: partial.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-mat",
    title: partial.title,
    description: partial.description,
    subject: partial.subject,
    semester: partial.semester,
    tags: partial.tags,
    fileType: partial.fileType,
    fileUrl: partial.fileUrl,
    driveId: driveMeta.id,
    thumbnailUrl: partial.thumbnailUrl ?? null,
    uploadedBy: partial.uploadedBy,
    createdAt: now,
    updatedAt: now,
    versions,
    archived: partial.archived ?? false,
    collection: partial.collection,
  }
}

export const sampleMaterials: Material[] = [
  buildMaterial({
    title: "Linear Algebra Cheat Sheet",
    description: "Concise formulas for vector spaces and eigen problems.",
    subject: "Mathematics",
    semester: "Fall 2024",
    tags: ["vectors", "exam"],
    fileType: "pdf",
    fileUrl: "https://drive.google.com/file/d/1ALGEBRA123456789/view?usp=sharing",
    uploadedBy: "Tejo",
    thumbnailUrl: null,
    collection: "STEM Essentials",
  }),
  buildMaterial({
    title: "Operating Systems Slides",
    description: "Deck covering process scheduling and virtual memory.",
    subject: "Computer Science",
    semester: "Fall 2024",
    tags: ["slides", "kernel"],
    fileType: "google-slide",
    fileUrl: "https://docs.google.com/presentation/d/1OSSLIDES987654321/edit?usp=sharing",
    uploadedBy: "Tejo",
    collection: "Systems",
  }),
  buildMaterial({
    title: "Thermodynamics Lab Walkthrough",
    description: "20-min lab recap with instrumentation tips.",
    subject: "Mechanical Engineering",
    semester: "Spring 2025",
    tags: ["lab", "video"],
    fileType: "video",
    fileUrl: "https://drive.google.com/file/d/1THERMOVID9999/view?usp=sharing",
    uploadedBy: "Guest Lecturer",
  }),
  buildMaterial({
    title: "Marketing Research Template",
    description: "Editable Google Doc for consumer interviews.",
    subject: "Business",
    semester: "Spring 2025",
    tags: ["template", "doc"],
    fileType: "google-doc",
    fileUrl: "https://docs.google.com/document/d/1MARKETDOC55555/edit?usp=sharing",
    uploadedBy: "Tejo",
  }),
  buildMaterial({
    title: "Digital Signal Processing Notes",
    description: "Annotated notes with z-transform derivations.",
    subject: "Electrical",
    semester: "Winter 2024",
    tags: ["signals", "analysis"],
    fileType: "pdf",
    fileUrl: "https://drive.google.com/file/d/1DSPPDF24680/view?usp=sharing",
    uploadedBy: "Tejo",
  }),
  buildMaterial({
    title: "Creative Writing Prompt Reel",
    description: "MP4 of five-minute prompts for warmups.",
    subject: "Humanities",
    semester: "Summer 2024",
    tags: ["writing", "creative"],
    fileType: "video",
    fileUrl: "https://drive.google.com/file/d/1WRITINGPROMPT777/view?usp=sharing",
    uploadedBy: "Creative Coach",
    archived: false,
  }),
]

export function inferFileTypeFromUrl(url: string) {
  return detectFileTypeFromUrl(url)
}

// Placeholder IDs above reference faux Google Drive assets. Replace with publicly shared links to enable embedding.
