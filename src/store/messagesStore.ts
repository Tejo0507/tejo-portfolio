import { create } from "zustand"
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware"
import type { AdminMessage } from "@/data/sampleMessages"
import { sampleMessages } from "@/data/sampleMessages"
import { addActivity } from "@/utils/activityLog"
import { timestampNow } from "@/utils/generateId"

export interface AdminMessageWithReply extends AdminMessage {
  reply?: {
    body: string
    sentAt: string
  }
}

interface MessageFilters {
  status: "all" | "unread" | "starred" | "archived"
  search: string
}

interface MessagesStoreState {
  messages: AdminMessageWithReply[]
  selectedId: string | null
  filters: MessageFilters
  setFilters: (filters: Partial<MessageFilters>) => void
  setSelected: (id: string | null) => void
  markRead: (id: string, read?: boolean) => void
  toggleStar: (id: string) => void
  toggleArchive: (id: string) => void
  deleteMessage: (id: string) => void
  quickReply: (id: string, body: string) => void
  addMessage: (message: AdminMessage) => void
  clearArchived: () => void
  importMessages: (messages: AdminMessageWithReply[]) => void
}

const memoryStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
}

const messageStorage = createJSONStorage<MessagesStoreState>(() => (typeof window !== "undefined" ? localStorage : memoryStorage))

export const useMessagesStore = create(
  persist<MessagesStoreState>(
    (set) => ({
      messages: sampleMessages,
      selectedId: null,
      filters: { status: "all", search: "" },
      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),
      setSelected: (id) => set({ selectedId: id }),
      markRead: (id, read = true) =>
        set((state) => {
          const message = state.messages.find((item) => item.id === id)
          if (!message) return state
          addActivity(message.subject, read ? "Marked as read" : "Marked as unread", "message")
          return {
            messages: state.messages.map((item) => (item.id === id ? { ...item, read } : item)),
          }
        }),
      toggleStar: (id) =>
        set((state) => {
          const message = state.messages.find((item) => item.id === id)
          if (!message) return state
          addActivity(message.subject, message.starred ? "Removed star" : "Starred message", "message")
          return {
            messages: state.messages.map((item) =>
              item.id === id ? { ...item, starred: !item.starred } : item
            ),
          }
        }),
      toggleArchive: (id) =>
        set((state) => {
          const message = state.messages.find((item) => item.id === id)
          if (!message) return state
          addActivity(message.subject, message.archived ? "Restored message" : "Archived message", "message")
          return {
            messages: state.messages.map((item) =>
              item.id === id ? { ...item, archived: !item.archived } : item
            ),
          }
        }),
      deleteMessage: (id) =>
        set((state) => {
          const message = state.messages.find((item) => item.id === id)
          if (!message) return state
          addActivity(message.subject, "Deleted message", "message")
          return {
            messages: state.messages.filter((item) => item.id !== id),
            selectedId: state.selectedId === id ? null : state.selectedId,
          }
        }),
      quickReply: (id, body) =>
        set((state) => {
          const message = state.messages.find((item) => item.id === id)
          if (!message) return state
          addActivity(message.subject, "Queued quick reply", "message")
          return {
            messages: state.messages.map((item) =>
              item.id === id ? { ...item, reply: { body, sentAt: timestampNow() }, read: true } : item
            ),
          }
        }),
      addMessage: (message) =>
        set((state) => {
          addActivity(message.subject, "Captured new message", "message")
          return { messages: [{ ...message }, ...state.messages] }
        }),
      clearArchived: () =>
        set((state) => {
          const removed = state.messages.filter((message) => message.archived).length
          if (!removed) return state
          addActivity("Messages", `Cleared ${removed} archived`, "message")
          return {
            messages: state.messages.filter((message) => !message.archived),
          }
        }),
      importMessages: (messages) =>
        set(() => {
          addActivity("Messages", `Imported ${messages.length} threads`, "message")
          return { messages }
        }),
    }),
    {
      name: "portfolio-admin-messages",
      storage: messageStorage,
      skipHydration: typeof window === "undefined",
    }
  )
)

// Context fallback note: wrap `useMessagesStore` in React context if Zustand becomes unavailable.
