import type { Snippet } from "@/types/snippet"

export const sampleSnippets: Snippet[] = [
  {
    id: "snip-ts-hooks",
    title: "React useAsync hook",
    language: "typescript",
    tags: ["react", "hooks"],
    description: "Tiny helper to track promise state without extra libraries.",
    code: `import { useEffect, useState } from "react"

export function useAsync<T>(factory: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<{ data?: T; error?: unknown; loading: boolean }>({ loading: true })

  useEffect(() => {
    let mounted = true
    setState({ loading: true })
    factory()
      .then((data) => mounted && setState({ data, loading: false }))
      .catch((error) => mounted && setState({ error, loading: false }))
    return () => {
      mounted = false
    }
  }, deps)

  return state
}`,
    createdAt: "2024-03-12T09:00:00Z",
    updatedAt: "2024-05-08T12:30:00Z",
    author: "Tejo Sridhar M V S",
    versions: [
      {
        id: "v1",
        code: "// Initial commit\nexport const hello = () => 'hello'",
        createdAt: "2024-02-28T08:00:00Z",
        note: "First draft",
      },
    ],
    folderId: "hooks",
    favorite: true,
  },
  {
    id: "snip-sql-window",
    title: "SQL rolling revenue",
    language: "sql",
    tags: ["analytics", "finance"],
    description: "Window function to compute trailing 7-day revenue.",
    code: `SELECT
  day,
  SUM(revenue) OVER (
    ORDER BY day
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS rolling_7d
FROM daily_sales;`,
    createdAt: "2023-12-02T10:00:00Z",
    updatedAt: "2024-01-16T14:00:00Z",
    author: "Tejo Sridhar M V S",
    versions: [],
    folderId: "sql",
  },
  {
    id: "snip-py-datastruct",
    title: "Python chunk util",
    language: "python",
    tags: ["utility", "iterator"],
    description: "Split any iterable into fixed-size chunks.",
    code: `from typing import Iterable, Iterator, TypeVar

T = TypeVar("T")

def chunked(iterable: Iterable[T], size: int) -> Iterator[list[T]]:
    bucket: list[T] = []
    for item in iterable:
        bucket.append(item)
        if len(bucket) == size:
            yield bucket
            bucket = []
    if bucket:
        yield bucket`,
    createdAt: "2024-01-04T09:25:00Z",
    updatedAt: "2024-01-04T09:25:00Z",
    author: "Tejo Sridhar M V S",
    versions: [],
    folderId: "python",
  },
  {
    id: "snip-js-throttle",
    title: "Throttle util",
    language: "javascript",
    tags: ["performance", "browser"],
    description: "Throttle execution to the next animation frame.",
    code: `export function rafThrottle<T extends (...args: never[]) => void>(fn: T) {
  let frame: number | null = null
  return (...args: Parameters<T>) => {
    if (frame !== null) return
    frame = requestAnimationFrame(() => {
      fn(...args)
      frame = null
    })
  }
}`,
    createdAt: "2024-04-18T08:44:00Z",
    updatedAt: "2024-06-01T10:00:00Z",
    author: "Tejo Sridhar M V S",
    versions: [],
    folderId: "frontend",
    favorite: true,
  },
  {
    id: "snip-react-error",
    title: "Error boundary",
    language: "typescript",
    tags: ["react", "error-handling"],
    description: "Minimal error boundary component for experiments.",
    code: `import { Component, type ReactNode } from "react"

interface Props {
  fallback: ReactNode
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class MiniBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}`,
    createdAt: "2024-02-01T07:00:00Z",
    updatedAt: "2024-02-11T11:15:00Z",
    author: "Tejo Sridhar M V S",
    versions: [],
    folderId: "react",
  },
  {
    id: "snip-sql-json",
    title: "Postgres JSON flattener",
    language: "sql",
    tags: ["postgres", "json"],
    description: "Explode nested metadata from JSON payloads.",
    code: `SELECT
  user_id,
  meta ->> 'plan' AS plan,
  meta -> 'settings' ->> 'theme' AS theme
FROM events,
LATERAL jsonb_array_elements(events.metadata) AS meta;`,
    createdAt: "2023-11-22T13:20:00Z",
    updatedAt: "2024-03-18T10:45:00Z",
    author: "Tejo Sridhar M V S",
    versions: [],
    folderId: "sql",
  },
  {
    id: "snip-java-builder",
    title: "Fluent builder",
    language: "java",
    tags: ["patterns", "builder"],
    description: "Lightweight builder for crafting API requests.",
    code: `public class RequestBuilder {
  private final Map<String, String> params = new HashMap<>();

  public RequestBuilder add(String key, String value) {
    params.put(key, value);
    return this;
  }

  public Request build() {
    return new Request(params);
  }
}`,
    createdAt: "2024-05-05T16:05:00Z",
    updatedAt: "2024-05-05T16:05:00Z",
    author: "Tejo Sridhar M V S",
    versions: [],
    folderId: "java",
  },
  {
    id: "snip-ts-logger",
    title: "Structured logger",
    language: "typescript",
    tags: ["logging", "utility"],
    description: "Tiny logger that prefixes messages with timestamp.",
    code: String.raw`type Level = "info" | "warn" | "error"

export function createLogger(namespace: string) {
  const log = (level: Level, message: string, meta?: Record<string, unknown>) => {
    const time = new Date().toISOString()
    console[level](\`[\${time}] \${namespace} \${message}\`, meta ?? "")
  }
  return {
    info: (message: string, meta?: Record<string, unknown>) => log("info", message, meta),
    warn: (message: string, meta?: Record<string, unknown>) => log("warn", message, meta),
    error: (message: string, meta?: Record<string, unknown>) => log("error", message, meta),
  }
}`,
    createdAt: "2024-03-28T11:11:00Z",
    updatedAt: "2024-04-02T08:50:00Z",
    author: "Tejo Sridhar M V S",
    versions: [],
    folderId: null,
  },
]
