export interface BookChapter {
	slug: string
	title: string
	file: string
	order?: number
}

export interface BookManifest {
	title: string
	description?: string
	chapters: BookChapter[]
}

const FALLBACK_MANIFEST: BookManifest = {
	title: "Legacy Portfolio Codex",
	description: "Offline snapshot of the original flip-book portfolio.",
	chapters: [
		{ slug: "chapter-01-origin", title: "Origins & Sketches", file: "chapter-01.md" },
		{ slug: "chapter-02-build", title: "Building the Vision", file: "chapter-02.html" },
		{ slug: "chapter-03-reflections", title: "Reflections & Notes", file: "chapter-03.md" },
	],
}

const BASE_PATH = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "")

function toChapter(entry: Partial<BookChapter>, index: number): BookChapter {
	if (!entry.file) {
		throw new Error("Chapter file path missing")
	}
	return {
		slug: entry.slug ?? `chapter-${String(index + 1).padStart(2, "0")}`,
		title: entry.title ?? `Chapter ${index + 1}`,
		file: entry.file,
		order: entry.order ?? index + 1,
	}
}

export async function fetchBookManifest(signal?: AbortSignal): Promise<BookManifest> {
	const manifestUrl = `${BASE_PATH}/book-portfolio/book.json`

	try {
		const response = await fetch(manifestUrl, { signal })
		if (!response.ok) {
			throw new Error(`Manifest request failed with ${response.status}`)
		}
		const data = await response.json()

		if (!data || !Array.isArray(data.chapters)) {
			throw new Error("Manifest missing chapters array")
		}

			const normalizedChapters = data.chapters
				.map((chapter: Partial<BookChapter>, index: number) => {
				try {
					return toChapter(chapter, index)
				} catch (error) {
					console.warn("Skipping invalid chapter entry", error)
					return null
				}
			})
				.filter((chapter: BookChapter | null): chapter is BookChapter => Boolean(chapter))
				.sort((a: BookChapter, b: BookChapter) => (a.order ?? 0) - (b.order ?? 0))

		if (!normalizedChapters.length) {
			throw new Error("Manifest contained zero valid chapters")
		}

		return {
			title: data.title ?? FALLBACK_MANIFEST.title,
			description: data.description ?? FALLBACK_MANIFEST.description,
			chapters: normalizedChapters,
		}
	} catch (error) {
		console.warn("Falling back to static book manifest", error)
		return FALLBACK_MANIFEST
	}
}

export function resolveChapterAsset(chapter: BookChapter): string {
	return `${BASE_PATH}/book-portfolio/${chapter.file.replace(/^\//, "")}`
}

export function getFallbackManifest(): BookManifest {
	return FALLBACK_MANIFEST
}
