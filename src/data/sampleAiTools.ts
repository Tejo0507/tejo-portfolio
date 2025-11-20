export interface AdminAiTool {
  id: string
  name: string
  description: string
  tags: string[]
  icon: string
  category: string
  visible: boolean
  examplePrompts: string[]
}

export const sampleAiTools: AdminAiTool[] = [
  {
    id: "tool-kmeans",
    name: "KMeans Atelier",
    description: "Cluster explorer with realtime centroid choreography.",
    tags: ["vision", "teaching"],
    icon: "Sparkle",
    category: "Utility",
    visible: true,
    examplePrompts: ["Cluster new palette drops", "Visualize dataset drift"],
  },
  {
    id: "tool-story",
    name: "Story Engine",
    description: "Narrative thread generator with beat mapping.",
    tags: ["nlp", "creative"],
    icon: "BookOpen",
    category: "NLP",
    visible: true,
    examplePrompts: ["Outline a 4-act journey", "Brainstorm sensory hooks"],
  },
  {
    id: "tool-sonic",
    name: "Sonic Doodle",
    description: "Transforms brush strokes into ambient synth loops.",
    tags: ["audio", "fun"],
    icon: "Waveform",
    category: "Fun",
    visible: false,
    examplePrompts: ["Sketch a nebula", "Paint a sunrise"],
  },
]
