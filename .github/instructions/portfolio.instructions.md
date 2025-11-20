# Portfolio Copilot Instructions

## Project Overview
- Primary product: **Application Portfolio** built with React, TypeScript, and Vite.
- Legacy site: move all existing flip-book assets into `book-portfolio/` and leave untouched unless explicitly requested.
- Styling powered exclusively by Tailwind CSS; animations handled by Framer Motion.
- Maintain the following top-level folders: `components/`, `pages/`, `layouts/`, `hooks/`, `utils/`, `data/`, `book-portfolio/`.

## UI & UX Principles
- Palette is restricted to two colors: `#2E1F1B` and `#5E4B43`; derive tints/shades from these only.
- Deliver a minimal, elegant, modern interface that feels handcrafted, never robotic.
- Favor spacious layouts, strong typography hierarchy, and subtle motion.
- Copy must read naturally, as if written by a person—not generated jargon.

## Feature Requirements
- **Code Snippets Vault**: component collection for saving, copying, and previewing snippets; include search/filter controls and clipboard integration.
- **Mini OS Experience**: dedicate a page/layout for widget-style micro-apps with windowed interactions and smooth Framer Motion transitions.
- **Study Materials Hub**: list structured resources with integrated Google Drive links; ensure link metadata is configurable via `data/` entries.
- **Study Timetable Generator**: tool that creates personalized schedules; expose inputs (subjects, availability) and render an editable timetable.
- **Project Gallery**: grid with category filters and animation on filter change; source entries from structured data files.
- **Timeline Page**: chronological milestones with Framer Motion reveal effects.
- **Book Portfolio Sub-site**: mount the legacy portfolio inside `book-portfolio/` and provide navigation into it from the main app.

## Code Style & Contribution Rules
- Output full file contents when editing; partial snippets are not acceptable.
- Prefer concise functional components with hooks; avoid class components and unnecessary abstractions.
- Keep file names and exports readable (e.g., `StudyTimetableGenerator.tsx`).
- Align Tailwind classes for clarity; group layout, spacing, typography, and color tokens logically.
- Never introduce new directories or files unless explicitly requested.
- If requirements are ambiguous, ask one brief clarifying question before proceeding.
- Production-ready expectations: type-safe code, accessible semantics, and resilient error handling.

## Copilot Chat Behavior
- Explanations must be short and directly tied to the current task or file.
- Stay within the scope of the active feature, folder, or file—no unrelated scaffolding.
- Honor palette, structure, and conventions defined here at all times.
- Only ask questions when necessary to complete the work correctly.
- These rules override any conflicting defaults; do not ignore or supersede them without explicit instruction.
