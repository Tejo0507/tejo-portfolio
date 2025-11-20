import { MiniFeatureCard } from "@/components"
import { featureHighlights } from "@/data"
import type { FeatureHighlight } from "@/data"
import { useStaggeredList } from "@/hooks"

export function HomePage() {
  const staggeredVariants = useStaggeredList(featureHighlights.length)

  return (
    <section className="flex flex-col gap-12">
      <header className="flex flex-col gap-4">
        <p className="text-xs uppercase tracking-[0.4em] text-primary/70">Now Building</p>
        <h1 className="text-4xl font-serif text-foreground sm:text-5xl">
          A handcrafted operating system for learning, building, and sharing craft.
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground leading-relaxed">
          This is the planning canvas for the new application portfolio. Each tile below represents
          an experiential space I am prototyping next—from a snippet vault to an ambient study studio.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
  {featureHighlights.map((feature: FeatureHighlight, index: number) => (
          <MiniFeatureCard key={feature.title} {...feature} motionProps={staggeredVariants[index]} />
        ))}
      </div>
    </section>
  )
}
