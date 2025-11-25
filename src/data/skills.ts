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
    id: "python",
    name: "Python",
    categoryId: "ml",
    level: 92,
    description: "Primary language for AI/ML projects, data processing, and automation.",
    tags: ["python", "ml", "automation"],
    notes: "Extensive experience with NumPy, Pandas, and ML frameworks.",
    links: [{ label: "Projects", href: "/projects" }],
  },
  {
    id: "ai",
    name: "Artificial Intelligence",
    categoryId: "ml",
    level: 87,
    description: "Developing intelligent systems using machine learning and deep learning techniques.",
    tags: ["ai", "ml", "deep-learning"],
    notes: "Focus on practical AI applications and model deployment.",
    links: [{ label: "AI Projects", href: "/projects" }],
  },
  {
    id: "yolov8",
    name: "YOLOv8",
    categoryId: "ml",
    level: 82,
    description: "State-of-the-art object detection using YOLOv8 for real-time computer vision applications.",
    tags: ["computer-vision", "yolo", "object-detection"],
    notes: "Experience with YOLO models for live detection and custom training.",
    links: [{ label: "Computer Vision", href: "/projects" }],
  },
  {
    id: "google-api",
    name: "Google API",
    categoryId: "ml",
    level: 75,
    description: "Integration with Google Cloud services and APIs for AI/ML applications.",
    tags: ["api", "google-cloud", "integration"],
    notes: "Working with Google Maps API, Cloud Vision, and other Google services.",
    links: [{ label: "Projects", href: "/projects" }],
  },
  {
    id: "huggingface",
    name: "Hugging Face",
    categoryId: "ml",
    level: 80,
    description: "Using pre-trained models and transformers for NLP and computer vision tasks.",
    tags: ["nlp", "transformers", "huggingface"],
    notes: "Experience with model fine-tuning and deployment using Hugging Face ecosystem.",
    links: [{ label: "NLP Projects", href: "/projects" }],
  },
  {
    id: "datascience",
    name: "Data Science",
    categoryId: "ml",
    level: 85,
    description: "Data analysis, visualization, and statistical modeling for insights and predictions.",
    tags: ["datascience", "analytics", "visualization"],
    notes: "Expertise in exploratory data analysis, feature engineering, and data storytelling.",
    links: [{ label: "Data Projects", href: "/projects" }],
  },
  {
    id: "html",
    name: "HTML",
    categoryId: "frontend",
    level: 90,
    description: "Semantic HTML5 markup for building structured and accessible web pages.",
    tags: ["html", "web", "frontend"],
    notes: "Strong foundation in semantic HTML and web accessibility standards.",
    links: [{ label: "Web Projects", href: "/projects" }],
  },
  {
    id: "css",
    name: "CSS",
    categoryId: "frontend",
    level: 88,
    description: "Modern CSS for responsive design, animations, and styling.",
    tags: ["css", "design", "styling"],
    notes: "Experience with CSS Grid, Flexbox, and modern layout techniques.",
    links: [{ label: "Design", href: "/projects" }],
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    categoryId: "frontend",
    level: 85,
    description: "UI development with utility-first CSS framework.",
    tags: ["css", "design", "ui"],
    notes: "Building responsive and accessible interfaces with custom design systems.",
    links: [{ label: "Design", href: "/projects" }],
  },
  {
    id: "java",
    name: "Java",
    categoryId: "backend",
    level: 80,
    description: "Object-oriented programming with Java for backend development.",
    tags: ["java", "backend", "oop"],
    notes: "Experience with Java fundamentals and application development.",
    links: [{ label: "Projects", href: "/projects" }],
  },
  {
    id: "c",
    name: "C",
    categoryId: "backend",
    level: 75,
    description: "Fundamentals of C",
    tags: ["c", "fundamentals", "programming"],
    notes: "good foundation in C programming and data structures.",
    links: [{ label: "Projects", href: "/projects" }],
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
]
