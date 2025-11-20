import type { TimetableProfile } from "@/utils/timetableAlgo"

const today = new Date()
const plusDays = (value: number) => {
  const next = new Date(today)
  next.setDate(today.getDate() + value)
  return next.toISOString().split("T")[0]
}

export const sampleProfiles: TimetableProfile[] = [
  {
    id: "exam-ready",
    name: "Finals Sprint",
    preferredStudyDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
    dailyStudyHours: 4,
    studyWindow: { start: "18:00", end: "22:30" },
    breakSchedule: { focusMinutes: 45, breakMinutes: 10 },
    startDate: today.toISOString().split("T")[0],
    planSpanDays: 21,
    revisionFrequencyDays: 2,
    revisionSlotMinutes: 25,
    restBufferMinutes: 40,
    priorityWeights: {
      exam: 0.4,
      difficulty: 0.25,
      remaining: 0.25,
      topics: 0.1,
    },
    subjects: [
      {
        id: "math",
        name: "Advanced Calculus",
        estimatedHours: 18,
        difficulty: 5,
        examDate: plusDays(18),
        topics: [
          { id: "limits", title: "Limits + Continuity", estimatedMinutes: 180 },
          { id: "series", title: "Series and convergence", estimatedMinutes: 240 },
          { id: "integrals", title: "Multiple integrals", estimatedMinutes: 240 },
        ],
      },
      {
        id: "cs",
        name: "Systems Design",
        estimatedHours: 14,
        difficulty: 4,
        examDate: plusDays(25),
        topics: [
          { id: "queues", title: "Message queues", estimatedMinutes: 150 },
          { id: "sharding", title: "Sharding strategy", estimatedMinutes: 210 },
          { id: "caching", title: "Caching layers", estimatedMinutes: 150 },
        ],
      },
      {
        id: "literature",
        name: "World Literature",
        estimatedHours: 10,
        difficulty: 3,
        examDate: plusDays(14),
        topics: [
          { id: "poetry", title: "Poetry analysis", estimatedMinutes: 160 },
          { id: "novel", title: "Modern novels", estimatedMinutes: 220 },
        ],
      },
    ],
  },
  {
    id: "steady-growth",
    name: "Steady Practice",
    preferredStudyDays: ["monday", "wednesday", "friday", "saturday"],
    dailyStudyHours: 3,
    studyWindow: { start: "16:30", end: "21:00" },
    breakSchedule: { focusMinutes: 40, breakMinutes: 15 },
    planSpanDays: 28,
    revisionFrequencyDays: 3,
    revisionSlotMinutes: 30,
    restBufferMinutes: 60,
    priorityWeights: {
      exam: 0.3,
      difficulty: 0.2,
      remaining: 0.3,
      topics: 0.2,
    },
    subjects: [
      {
        id: "biology",
        name: "Human Biology",
        estimatedHours: 16,
        difficulty: 4,
        examDate: plusDays(35),
        topics: [
          { id: "cells", title: "Cell structures", estimatedMinutes: 180 },
          { id: "systems", title: "Human systems", estimatedMinutes: 240 },
          { id: "genetics", title: "Genetics", estimatedMinutes: 180 },
        ],
      },
      {
        id: "history",
        name: "Global History",
        estimatedHours: 12,
        difficulty: 3,
        examDate: plusDays(40),
        topics: [
          { id: "ww2", title: "WWII analysis", estimatedMinutes: 180 },
          { id: "movements", title: "Social movements", estimatedMinutes: 210 },
        ],
      },
      {
        id: "design",
        name: "Design Research",
        estimatedHours: 8,
        difficulty: 2,
        topics: [
          { id: "personas", title: "Personas", estimatedMinutes: 120 },
          { id: "journeys", title: "Journey maps", estimatedMinutes: 150 },
        ],
      },
    ],
    notes: "Balanced routine with ample rest days",
  },
]
