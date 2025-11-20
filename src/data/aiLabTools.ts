import {
  Brain,
  Image as ImageIcon,
  MessageSquareText,
  Binary,
  Split,
  Atom,
  Sigma,
  LayoutGrid,
  Bot,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { AiToolId } from "@/store/aiLabStore"

export interface AiToolMeta {
  id: AiToolId
  title: string
  description: string
  difficulty: "Easy" | "Medium" | "Advanced"
  icon: LucideIcon
}

export const AI_TOOL_META: AiToolMeta[] = [
  {
    id: "image-classification",
    title: "Image Classification",
    description: "Drop an image and watch a tiny TF model guess the vibe.",
    difficulty: "Advanced",
    icon: ImageIcon,
  },
  {
    id: "text-sentiment",
    title: "Text Sentiment",
    description: "Lexicon-based sentiment explorer for friendly copy.",
    difficulty: "Easy",
    icon: MessageSquareText,
  },
  {
    id: "number-predictor",
    title: "Number Prediction",
    description: "Train a micro regression model live in your browser.",
    difficulty: "Medium",
    icon: Sigma,
  },
  {
    id: "kmeans",
    title: "K-Means Visualizer",
    description: "Cluster playful dots and watch centroids wander.",
    difficulty: "Medium",
    icon: LayoutGrid,
  },
  {
    id: "pca",
    title: "PCA Visualizer",
    description: "Project multi-feature data down to calming 2D.",
    difficulty: "Advanced",
    icon: Split,
  },
  {
    id: "tokenizer",
    title: "Text Tokenizer",
    description: "Peek at token counts, bigrams, and friendly stats.",
    difficulty: "Easy",
    icon: Binary,
  },
  {
    id: "chatbot",
    title: "Pocket Chatbot",
    description: "Rule-based mentor with kind nudges.",
    difficulty: "Easy",
    icon: Bot,
  },
  {
    id: "matrix",
    title: "Matrix Calculator",
    description: "AI preprocessing helper for quick math checks.",
    difficulty: "Medium",
    icon: Brain,
  },
  {
    id: "scaling",
    title: "Scaling Playground",
    description: "Compare min-max vs standard scaling on the fly.",
    difficulty: "Medium",
    icon: Atom,
  },
]

export const getToolMeta = (id: AiToolId) => AI_TOOL_META.find((tool) => tool.id === id) ?? AI_TOOL_META[0]
