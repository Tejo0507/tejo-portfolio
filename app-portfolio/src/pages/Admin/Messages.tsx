import { useCallback, useEffect, useMemo, useState } from "react"
import { Inbox, Star, Bell, Archive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AdminLayout } from "@/components/Admin/AdminLayout"
import { MessageCard } from "@/components/Admin/MessageCard"
import { ConfirmDialog } from "@/components/Admin/ConfirmDialog"
import { useMessagesStore } from "@/store/messagesStore"

const statusFilters: Array<{ id: "all" | "unread" | "starred" | "archived"; label: string }> = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "starred", label: "Starred" },
  { id: "archived", label: "Archived" },
]

export default function AdminMessagesPage() {
  const messages = useMessagesStore((state) => state.messages)
  const selectedId = useMessagesStore((state) => state.selectedId)
  const filters = useMessagesStore((state) => state.filters)
  const setFilters = useMessagesStore((state) => state.setFilters)
  const setSelected = useMessagesStore((state) => state.setSelected)
  const markRead = useMessagesStore((state) => state.markRead)
  const toggleStar = useMessagesStore((state) => state.toggleStar)
  const toggleArchive = useMessagesStore((state) => state.toggleArchive)
  const deleteMessage = useMessagesStore((state) => state.deleteMessage)
  const quickReply = useMessagesStore((state) => state.quickReply)
  const clearArchived = useMessagesStore((state) => state.clearArchived)

  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({})
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)
  const [pendingClear, setPendingClear] = useState(false)

  const filteredMessages = useMemo(() => {
    const query = filters.search.toLowerCase()
    return messages.filter((message) => {
      if (filters.status === "unread" && message.read) return false
      if (filters.status === "starred" && !message.starred) return false
      if (filters.status === "archived" && !message.archived) return false
      if (filters.status === "all" && message.archived) return false
      if (query) {
        const haystack = `${message.subject} ${message.name} ${message.email} ${message.message}`.toLowerCase()
        if (!haystack.includes(query)) return false
      }
      return true
    })
  }, [messages, filters])

  const currentMessage = useMemo(() => messages.find((message) => message.id === selectedId) ?? null, [messages, selectedId])
  const replyDraft = selectedId ? replyDrafts[selectedId] ?? currentMessage?.reply?.body ?? "" : ""

  const handleReplyChange = (value: string) => {
    if (!selectedId) return
    setReplyDrafts((drafts) => ({ ...drafts, [selectedId]: value }))
  }

  const handleSendReply = () => {
    if (!selectedId) return
    if (!replyDraft.trim()) return
    quickReply(selectedId, replyDraft.trim())
    setReplyDrafts((drafts) => ({ ...drafts, [selectedId]: "" }))
  }

  const stats = useMemo(
    () => [
      { label: "Inbox", icon: Inbox, count: messages.filter((message) => !message.archived).length, meta: "Active" },
      { label: "Unread", icon: Bell, count: messages.filter((message) => !message.read && !message.archived).length, meta: "Need reply" },
      { label: "Starred", icon: Star, count: messages.filter((message) => message.starred && !message.archived).length, meta: "Priority" },
    ],
    [messages]
  )

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (!selectedId) return
      if ((event.target as HTMLElement | null)?.tagName?.toLowerCase() === "textarea") return
      if (event.key === "Delete") {
        event.preventDefault()
        setPendingDelete(selectedId)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [selectedId])

  const handleCardOpen = useCallback(
    (id: string) => {
      setSelected(id)
      markRead(id, true)
    },
    [setSelected, markRead]
  )

  return (
    <AdminLayout title="Messages">
      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <article key={stat.label} className="rounded-3xl border border-[#5E4B43]/30 bg-[#1B120D]/80 p-5 text-[#F2E4DC]">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">{stat.label}</p>
              <stat.icon className="h-4 w-4 text-[#F2E4DC]/60" />
            </div>
            <p className="mt-3 text-3xl font-semibold">{stat.count}</p>
            <p className="text-xs text-[#F2E4DC]/60">{stat.meta}</p>
          </article>
        ))}
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#5E4B43]/40 p-1">
          {statusFilters.map((filter) => (
            <Button
              key={filter.id}
              variant={filters.status === filter.id ? "default" : "ghost"}
              className={filters.status === filter.id ? "bg-[#5E4B43] text-[#120906]" : "text-[#F2E4DC]/70"}
              onClick={() => setFilters({ status: filter.id })}
            >
              {filter.label}
            </Button>
          ))}
        </div>
        <Input
          value={filters.search}
          onChange={(event) => setFilters({ search: event.target.value })}
          placeholder="Search subjects or senders"
          className="max-w-xs"
        />
        <Button variant="ghost" className="text-[#F2E4DC]/70" onClick={() => setPendingClear(true)}>
          <Archive className="mr-2 h-4 w-4" /> Clear archived
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <MessageCard
              key={message.id}
              message={message}
              onOpen={() => handleCardOpen(message.id)}
              onStar={() => toggleStar(message.id)}
              onArchive={() => toggleArchive(message.id)}
              onDelete={() => setPendingDelete(message.id)}
              onQuickReply={() => {
                handleCardOpen(message.id)
              }}
            />
          ))}
          {!filteredMessages.length ? (
            <p className="rounded-3xl border border-dashed border-[#5E4B43]/40 p-6 text-center text-sm text-[#F2E4DC]/60">
              No messages in this filter.
            </p>
          ) : null}
        </div>

        <aside className="rounded-3xl border border-[#5E4B43]/30 bg-[#120906]/80 p-6 text-[#F2E4DC]">
          {currentMessage ? (
            <div className="space-y-4">
              <header className="space-y-1">
                <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">{currentMessage.subject}</p>
                <h3 className="text-2xl font-semibold">{currentMessage.name}</h3>
                <p className="text-sm text-[#F2E4DC]/70">{currentMessage.email}</p>
                <p className="text-xs text-[#F2E4DC]/50">{new Date(currentMessage.createdAt).toLocaleString()}</p>
              </header>
              <p className="text-sm text-[#F2E4DC]/80">{currentMessage.message}</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#5E4B43]/40 text-[#F2E4DC]"
                  onClick={() => markRead(currentMessage.id, !currentMessage.read)}
                >
                  {currentMessage.read ? "Mark unread" : "Mark read"}
                </Button>
                <Button size="sm" variant="ghost" className="text-[#F2E4DC]/70" onClick={() => toggleStar(currentMessage.id)}>
                  {currentMessage.starred ? "Unstar" : "Star"}
                </Button>
                <Button size="sm" variant="ghost" className="text-[#F2E4DC]/70" onClick={() => toggleArchive(currentMessage.id)}>
                  {currentMessage.archived ? "Restore" : "Archive"}
                </Button>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">Quick reply</label>
                <Textarea rows={4} value={replyDraft} onChange={(event) => handleReplyChange(event.target.value)} placeholder="Thank you for reaching out..." />
                <div className="flex flex-wrap gap-3">
                  <Button className="bg-[#5E4B43] text-[#120906]" onClick={handleSendReply}>
                    Send reply
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-[#F2E4DC]/60"
                    onClick={() => handleReplyChange("")}
                    disabled={!replyDraft.trim()}
                  >
                    Clear
                  </Button>
                </div>
                {currentMessage.reply ? (
                  <p className="text-xs text-[#F2E4DC]/60">
                    Last reply sent {new Date(currentMessage.reply.sentAt).toLocaleString()}
                  </p>
                ) : null}
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#F2E4DC]/60">Select a message to view details and craft a quick reply.</p>
          )}
        </aside>
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete message?"
        description="This removes the conversation permanently."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (!pendingDelete) return
          deleteMessage(pendingDelete)
          setPendingDelete(null)
        }}
        onCancel={() => setPendingDelete(null)}
      />

      <ConfirmDialog
        open={pendingClear}
        title="Clear archived threads?"
        description="All archived messages will be removed from the inbox."
        confirmLabel="Clear archived"
        destructive
        onConfirm={() => {
          clearArchived()
          setPendingClear(false)
        }}
        onCancel={() => setPendingClear(false)}
      />
    </AdminLayout>
  )
}
