export interface SkillCategory {
  id: string
  name: string
  icon: string
}

export interface SkillMeta {
  id: string
  name: string
  categoryId: string
  level: number
  description: string
  tags: string[]
  notes: string
  links?: { label: string; href: string }[]
}

export const skillCategories: SkillCategory[] = [
  { id: "ml", name: "AI & ML", icon: "" },
  { id: "frontend", name: "Web Development", icon: "" },
  { id: "backend", name: "Backend & APIs", icon: "" },
  { id: "ops", name: "Tools & DevOps", icon: "" },
]

export const skills: SkillMeta[] = [
  {
    id: "pytorch",
    name: "PyTorch",
    categoryId: "ml",
    level: 85,
    description: "Building and training deep learning models for NLP and computer vision tasks.",
    tags: ["ml", "pytorch", "deep-learning"],
    notes: "Focus on practical implementations and model optimization for real-world applications.",
    links: [{ label: "AI Projects", href: "/projects" }],
  },
  {
    id: "tensorflow",
    name: "TensorFlow",
    categoryId: "ml",
    level: 80,
    description: "Developing machine learning models and deploying them to production environments.",
    tags: ["ml", "tensorflow", "deployment"],
    notes: "Experience with TensorFlow Serving and model optimization techniques.",
    links: [{ label: "ML Projects", href: "/projects" }],
  },
  {
    id: "langchain",
    name: "LangChain & RAG",
    categoryId: "ml",
    level: 75,
    description: "Building retrieval-aware assistants with guardrails and evaluation harnesses.",
    tags: ["llm", "rag", "ai"],
    notes: "Experimenting with structured outputs, memory windows, and voice-first UX.",
    links: [{ label: "AI Lab", href: "/ai-lab" }],
  },
  {
    id: "python",
    name: "Python",
    categoryId: "ml",
    level: 88,
    description: "Primary language for AI/ML projects, data processing, and automation.",
    tags: ["python", "ml", "automation"],
    notes: "Extensive experience with NumPy, Pandas, scikit-learn, and ML frameworks.",
    links: [{ label: "Projects", href: "/projects" }],
  },
  {
    id: "react",
    name: "React",
    categoryId: "frontend",
    level: 82,
    description: "Building modern web interfaces with hooks, context, and component composition.",
    tags: ["react", "frontend", "web"],
    notes: "Experience with React Router, state management, and performance optimization.",
    links: [{ label: "Portfolio", href: "/" }],
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    categoryId: "frontend",
    level: 80,
    description: "Rapid UI development with utility-first CSS framework.",
    tags: ["css", "design", "ui"],
    notes: "Building responsive and accessible interfaces with custom design systems.",
    links: [{ label: "Design", href: "/projects" }],
  },
  {
    id: "javascript",
    name: "JavaScript/TypeScript",
    categoryId: "frontend",
    level: 85,
    description: "Modern JavaScript and TypeScript for full-stack development.",
    tags: ["javascript", "typescript", "web"],
    notes: "Strong foundation in ES6+, async patterns, and type-safe development.",
    links: [{ label: "Web Projects", href: "/projects" }],
  },
  {
    id: "node",
    name: "Node.js",
    categoryId: "backend",
    level: 78,
    description: "Building RESTful APIs and server-side applications with Express.",
    tags: ["node", "api", "backend"],
    notes: "Experience with authentication, middleware patterns, and database integration.",
    links: [{ label: "Backend", href: "/projects" }],
  },
  {
    id: "postgres",
    name: "PostgreSQL",
    categoryId: "backend",
    level: 72,
    description: "Relational database design, queries, and optimization.",
    tags: ["sql", "database", "data"],
    notes: "Working with complex queries, indexes, and data modeling.",
    links: [{ label: "Data Projects", href: "/projects" }],
  },
  {
    id: "mongodb",
    name: "MongoDB",
    categoryId: "backend",
    level: 70,
    description: "NoSQL database for flexible data storage and retrieval.",
    tags: ["nosql", "database", "mongodb"],
    notes: "Experience with document modeling and aggregation pipelines.",
    links: [{ label: "Projects", href: "/projects" }],
  },
  {
    id: "git",
    name: "Git & GitHub",
    categoryId: "ops",
    level: 83,
    description: "Version control, collaboration, and CI/CD workflows.",
    tags: ["git", "devops", "collaboration"],
    notes: "Managing repositories, branches, pull requests, and automated workflows.",
    links: [{ label: "GitHub", href: "https://github.com/Tejo0507" }],
  },
  {
    id: "docker",
    name: "Docker",
    categoryId: "ops",
    level: 68,
    description: "Containerization for consistent development and deployment environments.",
    tags: ["docker", "devops", "containers"],
    notes: "Creating efficient Docker images and compose configurations.",
    links: [{ label: "DevOps", href: "/projects" }],
  },
]
