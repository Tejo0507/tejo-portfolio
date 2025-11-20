export interface TimelineEntry {
  year: string
  title: string
  description: string
  icon?: string
}

export const timelineEntries: TimelineEntry[] = [
  {
    year: "2012",
    title: "School Science Fair",
    description: "First time building something from scratch—a cardboard rover with blinking LEDs that sparked the obsession.",
    icon: "🎓",
  },
  {
    year: "2015",
    title: "First Lines of Code",
    description: "Wrote a cricket score tracker in C on a borrowed laptop and realized logic can feel like poetry.",
    icon: "💻",
  },
  {
    year: "2018",
    title: "College Projects",
    description: "Led campus teams shipping research demos, learning how to pair clarity with shipping deadlines.",
    icon: "🏛️",
  },
  {
    year: "2022",
    title: "AIML Builds",
    description: "Prototyped explainable AI tools and NLP assistants focused on helping students learn faster.",
    icon: "🧠",
  },
  {
    year: "2024",
    title: "Portfolio Launch",
    description: "Released this living portfolio as a warm, interactive desk to showcase systems thinking and craft.",
    icon: "🚀",
  },
]
