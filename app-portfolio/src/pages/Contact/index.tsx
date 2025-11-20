import { MainLayout } from "@/layouts"
import { motion } from "framer-motion"
import { Mail, MapPin, Github, Linkedin, Instagram } from "lucide-react"

export default function ContactPage() {
  const contactLinks = [
    {
      icon: Mail,
      label: "Email",
      value: "tejosridhar.mvs@gmail.com",
      href: "mailto:tejosridhar.mvs@gmail.com",
    },
    {
      icon: Github,
      label: "GitHub",
      value: "@Tejo0507",
      href: "https://github.com/Tejo0507",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "tejosridhar",
      href: "https://www.linkedin.com/in/tejosridhar",
    },
    {
      icon: Instagram,
      label: "Instagram",
      value: "@me.tejo",
      href: "https://www.instagram.com/me.tejo",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Chennai",
      href: null,
    },
  ]

  return (
    <MainLayout>
      <div className="relative min-h-screen bg-gradient-to-b from-dark via-dark/95 to-dark text-medium">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,_rgba(94,75,67,0.15),_transparent_55%)]" aria-hidden />

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col gap-12 px-6 py-20">
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.45, 0.05, 0.25, 0.95] }}
            className="flex flex-col gap-4"
          >
            <p className="text-xs uppercase tracking-[0.4em] text-medium/70">Get in Touch</p>
            <h1 className="text-4xl font-semibold leading-tight text-medium">Let's Connect</h1>
            <p className="max-w-2xl text-base text-medium/80">
              Feel free to reach out via email or connect with me on social platforms. I'm always open to discussing
              new projects, creative ideas, or opportunities to be part of your vision.
            </p>
          </motion.header>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.45, 0.05, 0.25, 0.95] }}
            className="grid gap-6 sm:grid-cols-2"
          >
            {contactLinks.map((link, index) => {
              const Icon = link.icon
              const content = (
                <>
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-medium/70" />
                    <span className="text-sm font-medium text-medium/70">{link.label}</span>
                  </div>
                  <p className="text-base font-medium text-medium">{link.value}</p>
                </>
              )

              return link.href ? (
                <motion.a
                  key={index}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex flex-col gap-2 rounded-2xl border border-medium/10 bg-dark/40 p-6 transition-all duration-smooth ease-smooth hover:border-medium/30 hover:bg-dark/60"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {content}
                </motion.a>
              ) : (
                <div
                  key={index}
                  className="flex flex-col gap-2 rounded-2xl border border-medium/10 bg-dark/40 p-6"
                >
                  {content}
                </div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </MainLayout>
  )
}
