export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"

export interface TopicEntry {
  id: string
  title: string
  estimatedMinutes: number
  completedMinutes?: number
}

export interface SubjectEntry {
  id: string
  name: string
  estimatedHours: number
  difficulty: number // 1 - 5
  topics: TopicEntry[]
  examDate?: string
  startDate?: string
  priorityWeight?: number
}

export interface AvailabilityWindow {
  start: string // "18:00"
  end: string // "22:00"
}

export interface BreakSchedule {
  focusMinutes: number
  breakMinutes: number
}

export interface PriorityWeights {
  exam: number
  difficulty: number
  remaining: number
  topics: number
}

export interface TimetableProfile {
  id: string
  name: string
  subjects: SubjectEntry[]
  preferredStudyDays: DayOfWeek[]
  dailyStudyHours: number
  dailyAvailabilityOverrides?: Partial<Record<DayOfWeek, number>>
  studyWindow: AvailabilityWindow
  breakSchedule?: BreakSchedule
  startDate?: string
  revisionFrequencyDays?: number
  revisionSlotMinutes?: number
  planSpanDays?: number
  restBufferMinutes?: number
  priorityWeights: PriorityWeights
  notes?: string
}

export type SlotType = "study" | "revision" | "break" | "rest"
export type SlotStatus = "pending" | "done" | "missed"

export interface TimeSlot {
  id: string
  type: SlotType
  subjectId?: string
  topicId?: string
  topicTitle?: string
  startTime: string
  endTime: string
  durationMinutes: number
  status: SlotStatus
  notes?: string
}

export interface DaySchedule {
  id: string
  date: string
  dayName: DayOfWeek
  slots: TimeSlot[]
  totalAllocatedMinutes: number
  completedMinutes: number
  restBufferMinutes: number
}

export interface SubjectSummary {
  subjectId: string
  name: string
  allocatedMinutes: number
  remainingMinutes: number
  completionEstimate: number
  nextSession?: string
}

export interface TimetablePlan {
  id: string
  profileId: string
  generatedAt: string
  spanDays: number
  revisionFrequencyDays: number
  days: DaySchedule[]
  subjectSummaries: SubjectSummary[]
  notes?: string
}

export interface GeneratePlanOptions {
  startDate?: string
  days?: number
  revisionFrequencyDays?: number
  includeRestDays?: boolean
}

interface SubjectState {
  subject: SubjectEntry
  remainingMinutes: number
  topics: TopicEntry[]
  lastRevisionDayIndex: number | null
}

const DAY_NAMES: DayOfWeek[] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]

const MIN_REST_BUFFER = 30
const DEFAULT_STUDY_WINDOW: AvailabilityWindow = { start: "17:00", end: "21:00" }
const DEFAULT_BREAKS: BreakSchedule = { focusMinutes: 50, breakMinutes: 10 }

const createId = () => (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2))

const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`
}

const parseTime = (value: string) => {
  const [h, m] = value.split(":").map(Number)
  return h * 60 + m
}

const addDays = (date: Date, days: number) => {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

const daysBetween = (from: Date, to?: Date) => {
  if (!to) return 30
  const diff = to.getTime() - from.getTime()
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)))
}

const createSubjectState = (subjects: SubjectEntry[]): Map<string, SubjectState> => {
  const map = new Map<string, SubjectState>()
  subjects.forEach((subject) => {
    map.set(subject.id, {
      subject,
      remainingMinutes: subject.estimatedHours * 60,
      topics: subject.topics.map((topic) => ({ ...topic })),
      lastRevisionDayIndex: null,
    })
  })
  return map
}

const scoreSubject = (subjectState: SubjectState, date: Date, weights: PriorityWeights) => {
  const { subject, remainingMinutes } = subjectState
  const examDate = subject.examDate ? new Date(subject.examDate) : null
  const daysUntilExam = examDate ? daysBetween(date, examDate) : 60
  const examFactor = 1 / daysUntilExam
  const difficultyFactor = subject.difficulty / 5
  const remainingFactor = remainingMinutes / Math.max(1, subject.estimatedHours * 60)
  const topicsRemaining = subjectState.topics.filter((topic) => (topic.estimatedMinutes - (topic.completedMinutes ?? 0)) > 0).length
  const topicsFactor = topicsRemaining / Math.max(1, subject.topics.length)
  const priorityWeight = subject.priorityWeight ?? 1

  return (
    weights.exam * examFactor +
    weights.difficulty * difficultyFactor +
    weights.remaining * remainingFactor +
    weights.topics * topicsFactor
  ) * priorityWeight
}

const takeTopicSlice = (subjectState: SubjectState, desiredMinutes: number) => {
  for (const topic of subjectState.topics) {
    const completed = topic.completedMinutes ?? 0
    const remaining = Math.max(0, topic.estimatedMinutes - completed)
    if (remaining === 0) continue

    const allocation = Math.min(remaining, desiredMinutes)
    topic.completedMinutes = completed + allocation
    subjectState.remainingMinutes = Math.max(0, subjectState.remainingMinutes - allocation)
    return {
      topicId: topic.id,
      topicTitle: topic.title,
      minutesUsed: allocation,
    }
  }

  // Fallback if no topics remain
  subjectState.remainingMinutes = Math.max(0, subjectState.remainingMinutes - desiredMinutes)
  return {
    topicId: undefined,
    topicTitle: undefined,
    minutesUsed: desiredMinutes,
  }
}

const ensureRestSlot = (schedule: DaySchedule) => {
  if (schedule.restBufferMinutes <= 0) return schedule
  const existingRest = schedule.slots.find((slot) => slot.type === "rest")
  if (existingRest) return schedule

    schedule.slots.push({
      id: createId(),
    type: "rest",
    startTime: "--",
    endTime: "--",
    durationMinutes: schedule.restBufferMinutes,
    status: "pending",
  })
  return schedule
}

export const allocateDailySlots = (
  profile: TimetableProfile,
  date: Date,
  subjectState: Map<string, SubjectState>,
  dayIndex = 0,
  revisionFrequency = 3,
  includeRest = true,
): DaySchedule => {
  const breakSchedule = profile.breakSchedule ?? DEFAULT_BREAKS
  const restBuffer = profile.restBufferMinutes ?? MIN_REST_BUFFER
  const window = profile.studyWindow ?? DEFAULT_STUDY_WINDOW
  const windowMinutes = parseTime(window.end) - parseTime(window.start)
  const preferredName = DAY_NAMES[date.getDay()]
  const preferred = profile.preferredStudyDays.includes(preferredName as DayOfWeek)
  const dailyHours = profile.dailyAvailabilityOverrides?.[preferredName as DayOfWeek] ?? profile.dailyStudyHours
  const totalStudyMinutes = Math.min(windowMinutes, dailyHours * 60)

  const schedule: DaySchedule = {
      id: createId(),
    date: date.toISOString().split("T")[0],
    dayName: preferredName as DayOfWeek,
    slots: [],
    totalAllocatedMinutes: 0,
    completedMinutes: 0,
    restBufferMinutes: includeRest ? restBuffer : 0,
  }

  if (!preferred) {
    schedule.slots.push({
        id: createId(),
      type: "rest",
      startTime: window.start,
      endTime: window.end,
      durationMinutes: totalStudyMinutes,
      status: "pending",
      notes: "Preferred rest day",
    })
    schedule.totalAllocatedMinutes = totalStudyMinutes
    return schedule
  }

  let cursor = parseTime(window.start)
  const usableMinutes = Math.max(0, totalStudyMinutes - restBuffer)
  let minutesScheduled = 0

  const sortedSubjects = Array.from(subjectState.values())
    .filter((state) => state.remainingMinutes > 0)
    .sort((a, b) => scoreSubject(b, date, profile.priorityWeights) - scoreSubject(a, date, profile.priorityWeights))

  const allocateSession = (state: SubjectState, type: SlotType, duration: number) => {
    const { topicId, topicTitle, minutesUsed } = takeTopicSlice(state, duration)
    const slot: TimeSlot = {
      id: createId(),
      type,
      subjectId: state.subject.id,
      topicId,
      topicTitle,
      startTime: formatTime(cursor),
      endTime: formatTime(cursor + minutesUsed),
      durationMinutes: minutesUsed,
      status: "pending",
    }
    schedule.slots.push(slot)
    cursor += minutesUsed
    minutesScheduled += minutesUsed
    schedule.totalAllocatedMinutes += minutesUsed
  }

  let subjectPointer = 0
  while (minutesScheduled + breakSchedule.focusMinutes <= usableMinutes && sortedSubjects.length) {
    const targetState = sortedSubjects[subjectPointer % sortedSubjects.length]
    const focusMinutes = Math.min(breakSchedule.focusMinutes, targetState.remainingMinutes)
    if (focusMinutes <= 0) {
      subjectPointer++
      continue
    }

    allocateSession(targetState, "study", focusMinutes)

    // Insert revision slot if due
    if (
      revisionFrequency > 0 &&
      (targetState.lastRevisionDayIndex === null || dayIndex - targetState.lastRevisionDayIndex >= revisionFrequency)
    ) {
      const revisionMinutes = Math.min(profile.revisionSlotMinutes ?? 30, usableMinutes - minutesScheduled)
      if (revisionMinutes > 0) {
        schedule.slots.push({
          id: createId(),
          type: "revision",
          subjectId: targetState.subject.id,
          startTime: formatTime(cursor),
          endTime: formatTime(cursor + revisionMinutes),
          durationMinutes: revisionMinutes,
          status: "pending",
          notes: "Spaced repetition",
        })
        cursor += revisionMinutes
        minutesScheduled += revisionMinutes
        targetState.lastRevisionDayIndex = dayIndex
      }
    }

    if (minutesScheduled + breakSchedule.breakMinutes <= usableMinutes) {
      schedule.slots.push({
          id: createId(),
        type: "break",
        startTime: formatTime(cursor),
        endTime: formatTime(cursor + breakSchedule.breakMinutes),
        durationMinutes: breakSchedule.breakMinutes,
        status: "pending",
        notes: "Recharge",
      })
      cursor += breakSchedule.breakMinutes
      minutesScheduled += breakSchedule.breakMinutes
      schedule.totalAllocatedMinutes += breakSchedule.breakMinutes
    }

    subjectPointer++
  }

  ensureRestSlot(schedule)
  return schedule
}

export const estimateCompletion = (subject: SubjectEntry, allocatedMinutes: number) => {
  const required = subject.estimatedHours * 60
    return Math.min(1, allocatedMinutes / Math.max(1, required))
}

export const adjustForMissedSessions = (plan: TimetablePlan, missedDate: string): TimetablePlan => {
  const nextPlan: TimetablePlan = { ...plan, days: plan.days.map((day) => ({ ...day, slots: day.slots.map((slot) => ({ ...slot })) })) }
  const startIndex = nextPlan.days.findIndex((day) => day.date === missedDate)
  if (startIndex === -1) return plan

  const carrySlots: TimeSlot[] = []
  nextPlan.days[startIndex].slots = nextPlan.days[startIndex].slots.map((slot) => {
    if (slot.type === "study" && slot.status !== "done") {
      carrySlots.push({ ...slot, status: "pending" })
      return { ...slot, status: "missed" }
    }
    return slot
  })

  for (let i = startIndex + 1; i < nextPlan.days.length && carrySlots.length; i++) {
    const day = nextPlan.days[i]
    const rest = day.slots.find((slot) => slot.type === "rest")
    if (rest) {
      day.slots = day.slots.filter((slot) => slot !== rest)
      day.totalAllocatedMinutes -= rest.durationMinutes
    }
    const availableMinutes = Math.max(0, day.restBufferMinutes - day.completedMinutes)
    const slot = carrySlots.shift()
    if (slot) {
      day.slots.push({
        ...slot,
        startTime: day.slots.length ? day.slots[day.slots.length - 1].endTime : "08:00",
        endTime: slot.endTime,
      })
      day.totalAllocatedMinutes += slot.durationMinutes
    }
    if (availableMinutes > 0 && carrySlots.length === 0) {
      day.slots.push(rest ?? {
          id: createId(),
        type: "rest",
        startTime: "--",
        endTime: "--",
        durationMinutes: day.restBufferMinutes,
        status: "pending",
      })
    }
  }

  return nextPlan
}

export const generatePlan = (profile: TimetableProfile, options: GeneratePlanOptions = {}): TimetablePlan => {
  const startDate = options.startDate ? new Date(options.startDate) : profile.startDate ? new Date(profile.startDate) : new Date()
  const days = options.days ?? profile.planSpanDays ?? 14
  const revisionFrequency = options.revisionFrequencyDays ?? profile.revisionFrequencyDays ?? 3
  const includeRest = options.includeRestDays ?? true

  const subjectState = createSubjectState(profile.subjects)
  const schedules: DaySchedule[] = []

  for (let dayIndex = 0; dayIndex < days; dayIndex++) {
    const date = addDays(startDate, dayIndex)
    const schedule = allocateDailySlots(profile, date, subjectState, dayIndex, revisionFrequency, includeRest)
    schedules.push(schedule)
  }

  const subjectSummaries: SubjectSummary[] = profile.subjects.map((subject) => {
    const state = subjectState.get(subject.id)
    const allocated = subject.estimatedHours * 60 - (state?.remainingMinutes ?? 0)
    const completionEstimate = estimateCompletion(subject, allocated)
    const nextSlot = schedules
      .flatMap((day) => day.slots)
      .find((slot) => slot.subjectId === subject.id && slot.type !== "break" && slot.status !== "done")

    return {
      subjectId: subject.id,
      name: subject.name,
      allocatedMinutes: allocated,
      remainingMinutes: state?.remainingMinutes ?? 0,
      completionEstimate,
      nextSession: nextSlot?.startTime ? `${nextSlot.startTime} on ${nextSlot?.type === "revision" ? "revision" : "study"}` : undefined,
    }
  })

  return {
    id: `plan-${Date.now()}`,
    profileId: profile.id,
    generatedAt: new Date().toISOString(),
    spanDays: days,
    revisionFrequencyDays: revisionFrequency,
    days: schedules,
    subjectSummaries,
    notes: profile.notes,
  }
}
