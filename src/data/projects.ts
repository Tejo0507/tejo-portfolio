export interface FolderNode {
  name: string
  type: "file" | "folder"
  children?: FolderNode[]
}

export interface ProjectDetails {
  description: string
  architecture: string
  highlights: string[]
}

export interface ProjectRecord {
  id: string
  title: string
  summary: string
  details: ProjectDetails
  tech: string[]
  year: number
  repoUrl?: string
  liveUrl?: string
  images: string[]
  folderStructure?: FolderNode
}

export const projects: ProjectRecord[] = [
  {
    id: "hallucina-labs",
    title: "Hallucina.in",
    summary: "Advanced AI/ML experimentation platform with hallucination artworks.",
    details: {
      description: "A comprehensive AI laboratory platform for experimenting with hallucination artworks, and prompt engineering techniques.",
      architecture: "Python-based ML pipeline with modern web interface for live experimentation.",
      highlights: ["Hallucination artwork", "Neural Networks", "Prompt engineering"],
    },
    tech: ["Python", "Machine Learning", "NLP", "AI"],
    year: 2025,
    repoUrl: "https://github.com/Tejo0507/Hallucina.labs",
    liveUrl: "https://www.hallucina.in",
    images: ["/assets/projects/hallucina-labs.png"],
  },
  {
    id: "cabease",
    title: "CabEase",
    summary: "Smart cab booking and management system with live tracking.",
    details: {
      description: "A comprehensive cab booking platform that simplifies transportation with features like live tracking, fare estimation, and driver management.",
      architecture: "Full-stack application with responsive frontend and robust backend API.",
      highlights: ["Live tracking", "Fare estimation", "Driver management"],
    },
    tech: ["Python", "PostgreSQL", "Google Maps API"],
    year: 2025,
    repoUrl: "https://github.com/Tejo0507/CabEase",
    liveUrl: "",
    images: ["/assets/projects/cabease.png"],
  },
  {
    id: "neuronet",
    title: "NeuroNet",
    summary: "Neural network framework based Model using Eye Detection for detecting health diseases using deep learning model development.",
    details: {
      description: "A custom neural network implementation from scratch, providing into deep learning fundamentals and backpropagation algorithms.",
      architecture: "Pure Python implementation with NumPy, focusing on educational clarity and performance.",
      highlights: ["Custom neural network", " Training Dataset", "Training visualizations"],
    },
    tech: ["Python", "NumPy", "Deep Learning", "Neural Networks"],
    year: 2025,
    repoUrl: "https://github.com/Tejo0507/NeuroNet",
    liveUrl: "",
    images: ["/assets/projects/neuronet.png"],
  },
  {
    id: "object-detection-yolov8",
    title: "YOLOv8 Object Detection",
    summary: "Live object detection system using YOLOv8 and COCO dataset.",
    details: {
      description: "Implementation of state-of-the-art YOLOv8 object detection model trained on COCO dataset for live detection of 80+ object classes.",
      architecture: "YOLOv8 model with optimized inference pipeline and .",
      highlights: ["Live detection", "80+ object classes", "Webcam integration"],
    },
    tech: ["Python", "YOLOv8", "OpenCV", "PyTorch", "Computer Vision"],
    year: 2025,
    repoUrl: "https://github.com/Tejo0507/object-detection-yolov8-coco",
    liveUrl: "",
    images: ["/assets/projects/yolov8-detection.png"],
  },
  {
    id: "speech-translate-pro",
    title: "Speech Translate Pro",
    summary: "Live speech recognition and translation application.",
    details: {
      description: "Multi-language speech recognition and translation system with support forlive audio processing and text-to-speech capabilities.",
      architecture: "Speech recognition engine with translation API integration and audio processing pipeline.",
      highlights: ["Live translation", "Multi-language support", "Text-to-speech"],
    },
    tech: ["Python", "Speech Recognition", "Translation API", "Audio Processing"],
    year: 2025,
    repoUrl: "https://github.com/Tejo0507/speech_translate_pro",
    liveUrl: "",
    images: ["/assets/projects/speech-translate.png"],
  },
  {
    id: "expense-study-helper",
    title: "Expense Study Helper",
    summary: "Integrated expense tracking and study management application.",
    details: {
      description: "A dual-purpose application that helps students manage their expenses while organizing study schedules, materials, and academic progress.",
      architecture: "Web application with database integration for persistent storage and analytics.",
      highlights: ["Expense tracking", "Study scheduling", "Analytics dashboard"],
    },
    tech: ["Python", "SQLite"],
    year: 2025,
    repoUrl: "https://github.com/Tejo0507/expense_study_helper",
    liveUrl: "",
    images: ["/assets/projects/expense-study.png"],
  },
]
