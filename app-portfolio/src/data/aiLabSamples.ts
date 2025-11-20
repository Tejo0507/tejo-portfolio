export interface AiLabSampleRow {
  id: number
  studyHours: number
  focusLevel: number
  breakMinutes: number
  mood: number
  label: "Balanced" | "Needs Rest" | "On Fire"
}

export const aiLabSampleData: AiLabSampleRow[] = [
  { id: 1, studyHours: 2.5, focusLevel: 0.6, breakMinutes: 20, mood: 0.4, label: "Balanced" },
  { id: 2, studyHours: 5.1, focusLevel: 0.9, breakMinutes: 10, mood: 0.8, label: "On Fire" },
  { id: 3, studyHours: 1.2, focusLevel: 0.3, breakMinutes: 35, mood: 0.2, label: "Needs Rest" },
  { id: 4, studyHours: 3.8, focusLevel: 0.7, breakMinutes: 25, mood: 0.6, label: "Balanced" },
  { id: 5, studyHours: 4.6, focusLevel: 0.85, breakMinutes: 12, mood: 0.75, label: "On Fire" },
  { id: 6, studyHours: 2.0, focusLevel: 0.5, breakMinutes: 30, mood: 0.45, label: "Balanced" },
  { id: 7, studyHours: 0.9, focusLevel: 0.25, breakMinutes: 40, mood: 0.18, label: "Needs Rest" },
  { id: 8, studyHours: 3.2, focusLevel: 0.65, breakMinutes: 22, mood: 0.55, label: "Balanced" },
  { id: 9, studyHours: 4.9, focusLevel: 0.92, breakMinutes: 8, mood: 0.82, label: "On Fire" },
  { id: 10, studyHours: 1.7, focusLevel: 0.4, breakMinutes: 33, mood: 0.3, label: "Needs Rest" },
]
