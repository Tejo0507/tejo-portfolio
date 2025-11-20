import type { TimetablePlan } from "@/utils/timetableAlgo"

/**
 * Helper to convert a DOM node into a PDF using html2canvas + jspdf.
 * Usage example:
 * ```ts
 * const node = document.getElementById("weekly-view")
 * if (node) await exportNodeToPdf(node, "weekly-timetable.pdf")
 * ```
 */
export async function exportNodeToPdf(element: HTMLElement, filename: string) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")])
  const canvas = await html2canvas(element, {
    backgroundColor: "#2E1F1B",
    scale: window.devicePixelRatio || 2,
  })
  const imageData = canvas.toDataURL("image/png")
  const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [canvas.width, canvas.height] })
  pdf.addImage(imageData, "PNG", 0, 0, canvas.width, canvas.height)
  pdf.save(filename)
}

export function exportPlanToJson(plan: TimetablePlan) {
  const blob = new Blob([JSON.stringify(plan, null, 2)], { type: "application/json" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = `${plan.profileId}-plan.json`
  link.click()
  URL.revokeObjectURL(link.href)
}

export async function exportPlanSnapshot(plan: TimetablePlan, nodeIds: string[]) {
  for (const id of nodeIds) {
    const element = document.getElementById(id)
    if (!element) continue
    await exportNodeToPdf(element, `${plan.profileId}-${id}.pdf`)
  }
}
