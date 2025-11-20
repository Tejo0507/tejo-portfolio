import type { AdminMessageWithReply } from "@/store/messagesStore"
import { Button } from "@/components/ui/button"
import { MessageCircle, Star, Archive, Trash2 } from "lucide-react"
import { cn } from "@/utils"

interface MessageCardProps {
  message: AdminMessageWithReply
  onOpen: () => void
  onStar: () => void
  onArchive: () => void
  onDelete: () => void
  onQuickReply: () => void
}

export function MessageCard({ message, onOpen, onStar, onArchive, onDelete, onQuickReply }: MessageCardProps) {
  return (
    <article
      className={cn(
        "rounded-3xl border border-[#5E4B43]/30 bg-[#120906]/80 p-4 text-left transition",
        message.read ? "opacity-80" : "shadow-lg"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#F2E4DC]/60">{message.subject}</p>
          <h3 className="mt-1 text-lg font-semibold text-[#F2E4DC]">{message.name}</h3>
          <p className="text-sm text-[#F2E4DC]/70">{message.message.slice(0, 140)}...</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" aria-label="Star message" className={message.starred ? "text-amber-300" : "text-[#F2E4DC]/60"} onClick={onStar}>
            <Star className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Archive message" className="text-[#F2E4DC]/60" onClick={onArchive}>
            <Archive className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button className="bg-[#5E4B43] text-[#120906]" onClick={onOpen}>
          <MessageCircle className="mr-2 h-4 w-4" /> View
        </Button>
        <Button variant="ghost" className="text-[#F2E4DC]/70" onClick={onQuickReply}>
          Quick reply
        </Button>
        <Button variant="ghost" className="text-rose-300" onClick={onDelete}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </Button>
      </div>
      <p className="mt-3 text-xs text-[#F2E4DC]/50">{new Date(message.createdAt).toLocaleString()}</p>
    </article>
  )
}
