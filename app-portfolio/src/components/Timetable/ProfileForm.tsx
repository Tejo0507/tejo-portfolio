import { useMemo, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { CalendarCheck, PlusCircle, Trash2 } from "lucide-react"
import type { SubjectEntry, TimetableProfile, TopicEntry } from "@/utils/timetableAlgo"
import { useTimetableStore } from "@/store/timetableStore"

interface ProfileFormProps {
  profile?: TimetableProfile | null
}

const createId = () => (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2))

const defaultProfile = (): TimetableProfile => ({
  id: `profile-${Date.now()}`,
  name: "New Study Plan",
  preferredStudyDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  dailyStudyHours: 4,
  studyWindow: { start: "17:00", end: "22:00" },
  breakSchedule: { focusMinutes: 45, breakMinutes: 10 },
  revisionFrequencyDays: 3,
  revisionSlotMinutes: 30,
  restBufferMinutes: 45,
  planSpanDays: 14,
  priorityWeights: { exam: 0.4, difficulty: 0.2, remaining: 0.3, topics: 0.1 },
  subjects: [createBlankSubject()],
})

function createBlankSubject(): SubjectEntry {
  return {
    id: createId(),
    name: "",
    estimatedHours: 5,
    difficulty: 3,
    topics: [createBlankTopic()],
  }
}

function createBlankTopic(): TopicEntry {
  return {
    id: createId(),
    title: "",
    estimatedMinutes: 60,
  }
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const reduceMotion = useReducedMotion()
  const addProfile = useTimetableStore((state) => state.addProfile)
  const updateProfile = useTimetableStore((state) => state.updateProfile)
  const setActiveProfile = useTimetableStore((state) => state.setActiveProfile)
  
  const [draft, setDraft] = useState<TimetableProfile>(profile ?? defaultProfile())
  const [isEditing, setIsEditing] = useState(Boolean(profile))

  const dayOptions: { label: string; value: TimetableProfile["preferredStudyDays"][number] }[] = [
    { label: "Mon", value: "monday" },
    { label: "Tue", value: "tuesday" },
    { label: "Wed", value: "wednesday" },
    { label: "Thu", value: "thursday" },
    { label: "Fri", value: "friday" },
    { label: "Sat", value: "saturday" },
    { label: "Sun", value: "sunday" },
  ]

  const handleProfileField = (field: keyof TimetableProfile, value: unknown) => {
    setDraft((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubjectField = (subjectId: string, field: keyof SubjectEntry, value: unknown) => {
    setDraft((prev) => ({
      ...prev,
      subjects: prev.subjects.map((subject) => (subject.id === subjectId ? { ...subject, [field]: value } : subject)),
    }))
  }

  const handleTopicField = (subjectId: string, topicId: string, field: keyof TopicEntry, value: unknown) => {
    setDraft((prev) => ({
      ...prev,
      subjects: prev.subjects.map((subject) =>
        subject.id === subjectId
          ? {
              ...subject,
              topics: subject.topics.map((topic) => (topic.id === topicId ? { ...topic, [field]: value } : topic)),
            }
          : subject
      ),
    }))
  }

  const addSubject = () => handleProfileField("subjects", [createBlankSubject(), ...draft.subjects])
  const removeSubject = (subjectId: string) =>
    handleProfileField(
      "subjects",
      draft.subjects.length > 1 ? draft.subjects.filter((subject) => subject.id !== subjectId) : draft.subjects,
    )

  const addTopic = (subjectId: string) =>
    setDraft((prev) => ({
      ...prev,
      subjects: prev.subjects.map((subject) =>
        subject.id === subjectId ? { ...subject, topics: [...subject.topics, createBlankTopic()] } : subject,
      ),
    }))

  const removeTopic = (subjectId: string, topicId: string) =>
    setDraft((prev) => ({
      ...prev,
      subjects: prev.subjects.map((subject) =>
        subject.id === subjectId
          ? { ...subject, topics: subject.topics.filter((topic) => (subject.topics.length > 1 ? topic.id !== topicId : true)) }
          : subject
      ),
    }))

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!draft.name.trim()) return
    if (isEditing) {
      updateProfile(draft.id, draft)
      setActiveProfile(draft.id)
    } else {
      const newId = `profile-${Date.now()}`
      addProfile({ ...draft, id: newId })
      setDraft((prev) => ({ ...prev, id: newId }))
      setActiveProfile(newId)
    }
    setIsEditing(true)
  }

  const totalHours = useMemo(() => draft.subjects.reduce((sum, subject) => sum + subject.estimatedHours, 0), [draft.subjects])

  return (
    <motion.section
      layout
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-[#5E4B43]/40 bg-[#2E1F1B]/80 p-6 text-[#F7E6D4] shadow-[0_12px_45px_rgba(14,8,4,0.45)]"
      aria-labelledby="profile-form-title"
    >
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#F7E6D4]/70">Profile</p>
          <h2 id="profile-form-title" className="text-2xl font-semibold text-[#F7E6D4]">
            {isEditing ? "Edit profile" : "Create profile"}
          </h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#F7E6D4]/80">
          <CalendarCheck className="h-4 w-4" />
          <span>{totalHours}h planned</span>
        </div>
      </header>

      <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            <span className="text-[#F7E6D4]/70">Profile name</span>
            <input
              className="mt-1 w-full rounded-2xl border border-[#5E4B43]/50 bg-transparent px-3 py-2 text-base text-[#F7E6D4] focus:border-[#F7E6D4] focus:outline-none"
              value={draft.name}
              onChange={(event) => handleProfileField("name", event.target.value)}
              required
            />
          </label>
          <label className="text-sm">
            <span className="text-[#F7E6D4]/70">Plan length (days)</span>
            <input
              type="number"
              min={7}
              max={90}
              className="mt-1 w-full rounded-2xl border border-[#5E4B43]/50 bg-transparent px-3 py-2 text-[#F7E6D4]"
              value={draft.planSpanDays}
              onChange={(event) => handleProfileField("planSpanDays", Number(event.target.value))}
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="text-sm">
            <span className="text-[#F7E6D4]/70">Daily study hours</span>
            <input
              type="number"
              min={1}
              max={8}
              className="mt-1 w-full rounded-2xl border border-[#5E4B43]/50 bg-transparent px-3 py-2 text-[#F7E6D4]"
              value={draft.dailyStudyHours}
              onChange={(event) => handleProfileField("dailyStudyHours", Number(event.target.value))}
            />
          </label>
          <label className="text-sm">
            <span className="text-[#F7E6D4]/70">Study window start</span>
            <input
              type="time"
              className="mt-1 w-full rounded-2xl border border-[#5E4B43]/50 bg-transparent px-3 py-2 text-[#F7E6D4]"
              value={draft.studyWindow.start}
              onChange={(event) =>
                handleProfileField("studyWindow", { ...draft.studyWindow, start: event.target.value })
              }
            />
          </label>
          <label className="text-sm">
            <span className="text-[#F7E6D4]/70">Study window end</span>
            <input
              type="time"
              className="mt-1 w-full rounded-2xl border border-[#5E4B43]/50 bg-transparent px-3 py-2 text-[#F7E6D4]"
              value={draft.studyWindow.end}
              onChange={(event) => handleProfileField("studyWindow", { ...draft.studyWindow, end: event.target.value })}
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="text-sm">
            <span className="text-[#F7E6D4]/70">Revision frequency (days)</span>
            <input
              type="number"
              min={1}
              max={7}
              className="mt-1 w-full rounded-2xl border border-[#5E4B43]/50 bg-transparent px-3 py-2 text-[#F7E6D4]"
              value={draft.revisionFrequencyDays}
              onChange={(event) => handleProfileField("revisionFrequencyDays", Number(event.target.value))}
            />
          </label>
          <label className="text-sm">
            <span className="text-[#F7E6D4]/70">Revision slot minutes</span>
            <input
              type="number"
              min={15}
              max={60}
              className="mt-1 w-full rounded-2xl border border-[#5E4B43]/50 bg-transparent px-3 py-2 text-[#F7E6D4]"
              value={draft.revisionSlotMinutes}
              onChange={(event) => handleProfileField("revisionSlotMinutes", Number(event.target.value))}
            />
          </label>
          <label className="text-sm">
            <span className="text-[#F7E6D4]/70">Rest buffer (minutes)</span>
            <input
              type="number"
              min={30}
              max={120}
              className="mt-1 w-full rounded-2xl border border-[#5E4B43]/50 bg-transparent px-3 py-2 text-[#F7E6D4]"
              value={draft.restBufferMinutes}
              onChange={(event) => handleProfileField("restBufferMinutes", Number(event.target.value))}
            />
          </label>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#F7E6D4]/60">Preferred study days</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {dayOptions.map((option) => {
              const isSelected = draft.preferredStudyDays.includes(option.value)
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    handleProfileField(
                      "preferredStudyDays",
                      isSelected
                        ? draft.preferredStudyDays.filter((day) => day !== option.value)
                        : [...draft.preferredStudyDays, option.value],
                    )
                  }
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    isSelected
                      ? "bg-[#5E4B43] text-[#F7E6D4]"
                      : "border border-[#5E4B43]/40 text-[#F7E6D4]/70"
                  }`}
                  aria-pressed={isSelected}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.35em] text-[#F7E6D4]/60">Subjects</p>
            <button
              type="button"
              onClick={addSubject}
              className="inline-flex items-center gap-2 rounded-full border border-[#5E4B43]/50 px-3 py-1 text-sm text-[#F7E6D4]"
            >
              <PlusCircle className="h-4 w-4" /> Add subject
            </button>
          </div>
          <div className="space-y-4">
            {draft.subjects.map((subject) => (
              <div key={subject.id} className="rounded-2xl border border-[#5E4B43]/40 bg-[#1E1410]/80 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap gap-3">
                    <input
                      placeholder="Subject name"
                      className="rounded-2xl border border-[#5E4B43]/40 bg-transparent px-3 py-2 text-[#F7E6D4]"
                      value={subject.name}
                      onChange={(event) => handleSubjectField(subject.id, "name", event.target.value)}
                    />
                    <input
                      type="number"
                      min={1}
                      max={40}
                      className="w-28 rounded-2xl border border-[#5E4B43]/40 bg-transparent px-3 py-2 text-[#F7E6D4]"
                      value={subject.estimatedHours}
                      onChange={(event) => handleSubjectField(subject.id, "estimatedHours", Number(event.target.value))}
                      aria-label="Estimated hours"
                    />
                    <input
                      type="number"
                      min={1}
                      max={5}
                      className="w-20 rounded-2xl border border-[#5E4B43]/40 bg-transparent px-3 py-2 text-[#F7E6D4]"
                      value={subject.difficulty}
                      onChange={(event) => handleSubjectField(subject.id, "difficulty", Number(event.target.value))}
                      aria-label="Difficulty"
                    />
                    <input
                      type="date"
                      className="rounded-2xl border border-[#5E4B43]/40 bg-transparent px-3 py-2 text-[#F7E6D4]"
                      value={subject.examDate ?? ""}
                      onChange={(event) => handleSubjectField(subject.id, "examDate", event.target.value)}
                      aria-label="Exam date"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSubject(subject.id)}
                    className="self-start rounded-full border border-[#8A5B4A]/40 p-2 text-[#F7E6D4]/70 hover:text-[#F7E6D4]"
                    aria-label="Remove subject"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 space-y-2">
                  {subject.topics.map((topic) => (
                    <div key={topic.id} className="flex flex-col gap-2 rounded-2xl border border-[#5E4B43]/30 p-3 sm:flex-row">
                      <input
                        placeholder="Topic"
                        className="flex-1 rounded-2xl border border-[#5E4B43]/40 bg-transparent px-3 py-2 text-[#F7E6D4]"
                        value={topic.title}
                        onChange={(event) => handleTopicField(subject.id, topic.id, "title", event.target.value)}
                      />
                      <input
                        type="number"
                        min={15}
                        max={360}
                        className="w-32 rounded-2xl border border-[#5E4B43]/40 bg-transparent px-3 py-2 text-[#F7E6D4]"
                        value={topic.estimatedMinutes}
                        onChange={(event) =>
                          handleTopicField(subject.id, topic.id, "estimatedMinutes", Number(event.target.value))
                        }
                        aria-label="Topic minutes"
                      />
                      <button
                        type="button"
                        onClick={() => removeTopic(subject.id, topic.id)}
                        className="rounded-full border border-[#8A5B4A]/40 p-2 text-[#F7E6D4]/70"
                        aria-label="Remove topic"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addTopic(subject.id)}
                    className="inline-flex items-center gap-2 rounded-full border border-dashed border-[#5E4B43]/50 px-3 py-1 text-sm text-[#F7E6D4]/80"
                  >
                    <PlusCircle className="h-4 w-4" /> Topic
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {(["exam", "difficulty", "remaining", "topics"] as const).map((weight) => (
            <label key={weight} className="text-sm">
              <span className="text-[#F7E6D4]/70">{weight} weight</span>
              <input
                type="number"
                step="0.1"
                min={0}
                max={1}
                className="mt-1 w-full rounded-2xl border border-[#5E4B43]/50 bg-transparent px-3 py-2 text-[#F7E6D4]"
                value={draft.priorityWeights[weight]}
                onChange={(event) =>
                  handleProfileField("priorityWeights", {
                    ...draft.priorityWeights,
                    [weight]: Number(event.target.value),
                  })
                }
              />
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="w-full rounded-2xl bg-[#5E4B43] py-3 text-lg font-semibold text-[#F7E6D4] shadow-lg shadow-[#2E1F1B]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F7E6D4]"
        >
          {isEditing ? "Save changes" : "Create profile"}
        </button>
      </form>
    </motion.section>
  )
}
