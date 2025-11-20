export interface AdminMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  createdAt: string
  read: boolean
  starred: boolean
  archived: boolean
}

export const sampleMessages: AdminMessage[] = [
  {
    id: "msg-1",
    name: "Mara",
    email: "mara@studio.com",
    subject: "Collaboration on immersive site",
    message: "Loved the particle-universe background. Would you be open to a collab on a museum microsite?",
    createdAt: "2025-11-10T09:24:00Z",
    read: false,
    starred: true,
    archived: false,
  },
  {
    id: "msg-2",
    name: "Raj",
    email: "raj@mljournal.dev",
    subject: "Podcast invite",
    message: "We host a podcast about playful ML tools. Could you join us next month?",
    createdAt: "2025-11-08T16:14:00Z",
    read: false,
    starred: false,
    archived: false,
  },
  {
    id: "msg-3",
    name: "Studio Lynn",
    email: "hello@studiolynn.com",
    subject: "Quote request",
    message: "Looking to reimagine our agency site with a tactile storyboard feel. Please share a quick quote.",
    createdAt: "2025-11-05T11:02:00Z",
    read: true,
    starred: false,
    archived: false,
  },
]
