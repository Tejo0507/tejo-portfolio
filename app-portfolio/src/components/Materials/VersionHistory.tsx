import type { Material } from "@/types/materials"

interface VersionHistoryProps {
  material: Material
  activeVersionId: string | null
  onSelectVersion: (versionId: string) => void
}

export function VersionHistory({ material, activeVersionId, onSelectVersion }: VersionHistoryProps) {
  if (!material.versions.length) {
    return (
      <section className="rounded-3xl border border-[#5E4B43]/30 bg-[#2E1F1B]/70 p-6 text-center text-sm text-[#F7E6D4]/70">
        No versions uploaded yet.
      </section>
    )
  }

  return (
    <section className="rounded-3xl border border-[#5E4B43]/30 bg-[#2E1F1B]/70 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[#F7E6D4]/60">Version history</p>
          <p className="text-sm text-[#F7E6D4]/70">Track revisions and switch to older uploads.</p>
        </div>
        <span className="rounded-full border border-[#5E4B43]/40 px-3 py-1 text-xs text-[#F7E6D4]/70">
          {material.versions.length} total
        </span>
      </div>

      <ul className="mt-5 space-y-3">
        {material.versions.map((version) => {
          const isActive = version.id === activeVersionId
          return (
            <li key={version.id}>
              <button
                type="button"
                onClick={() => onSelectVersion(version.id)}
                className={`flex w-full flex-col rounded-2xl border px-4 py-3 text-left transition-all ${
                  isActive
                    ? "border-[#F7E6D4] bg-[#F7E6D4]/10 text-[#F7E6D4]"
                    : "border-[#5E4B43]/30 bg-transparent text-[#F7E6D4]/80 hover:border-[#F7E6D4]/40"
                }`}
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{version.fileType.toUpperCase()}</span>
                  <span>{new Date(version.addedAt).toLocaleString()}</span>
                </div>
                {version.notes && <p className="mt-1 text-xs opacity-80">{version.notes}</p>}
                <p className="mt-1 text-xs uppercase tracking-[0.2em] opacity-70">{version.uploadedBy}</p>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
