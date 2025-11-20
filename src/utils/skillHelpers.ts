import type { SkillItem, SkillLevel } from "@/data/sampleSkills"

const levelMap: Record<SkillLevel, { label: string; tone: string }> = {
  beginner: { label: "Beginner", tone: "text-[#F2E4DC]/70" },
  intermediate: { label: "Intermediate", tone: "text-[#F2E4DC]" },
  advanced: { label: "Advanced", tone: "text-[#F2E4DC] font-semibold" },
}

export function getLevelLabel(level: SkillLevel) {
  return levelMap[level]?.label ?? "Skill"
}

export function getLevelTone(level: SkillLevel) {
  return levelMap[level]?.tone ?? "text-[#F2E4DC]"
}

export function toRadialSeries(skills: SkillItem[]) {
  return skills.map((skill) => ({ name: skill.name, value: skill.progress }))
}

export function describeSkill(skill: SkillItem) {
  return `${skill.name} is at ${skill.progress}% (${getLevelLabel(skill.level)})`
}
