import { useState } from "react"
import type { FolderNode } from "@/data/projects"

interface FolderTreeProps {
  root: FolderNode
  basePath?: string
}

export default function FolderTree({ root, basePath = root.name }: FolderTreeProps) {
  return (
    <div role="tree" aria-label="Folder structure" className="space-y-1 text-sm text-medium/80">
      <FolderNodeItem node={root} path={basePath} depth={0} />
    </div>
  )
}

interface FolderNodeItemProps {
  node: FolderNode
  depth: number
  path: string
}

function FolderNodeItem({ node, depth, path }: FolderNodeItemProps) {
  const [expanded, setExpanded] = useState(true)
  const isFolder = node.type === "folder" && node.children && node.children.length > 0

  const copyPath = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(path).catch(() => undefined)
    }
  }

  return (
    <div role="treeitem" aria-expanded={isFolder ? expanded : undefined} className="space-y-1">
      <div className="flex items-center gap-2">
        {isFolder ? (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            aria-label={expanded ? "Collapse folder" : "Expand folder"}
            className="text-xs text-medium/70"
          >
            {expanded ? "−" : "+"}
          </button>
        ) : (
          <span className="w-3" />
        )}
        <div
          className="flex flex-1 items-center justify-between rounded-xl border border-medium/20 bg-dark/60 px-3 py-1"
          style={{ marginLeft: depth * 8 }}
        >
          <span className="flex items-center gap-2">
            <span aria-hidden>{node.type === "folder" ? "📁" : "📄"}</span>
            {node.name}
          </span>
          <button
            type="button"
            onClick={copyPath}
            className="text-xs uppercase tracking-[0.3em] text-medium/60 hover:text-medium"
          >
            Copy
          </button>
        </div>
      </div>
      {isFolder && expanded && (
        <div className="space-y-1">
          {node.children?.map((child) => (
            <FolderNodeItem key={child.name} node={child} depth={depth + 1} path={`${path}/${child.name}`} />
          ))}
        </div>
      )}
    </div>
  )
}
