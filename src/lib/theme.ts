export const palette = {
  dark: "#2E1F1B",
  medium: "#5E4B43",
  walnut: "#5E4B43",
  background: "#2E1F1B",
} as const

export type PaletteToken = keyof typeof palette

export const shadowPresets = {
  soft: "0 2px 6px rgba(0,0,0,0.25)",
  depth: "0 4px 12px rgba(0,0,0,0.35)",
  innerWarm: "inset 0 1px 0 rgba(255,255,255,0.05)",
} as const

export type ShadowPreset = keyof typeof shadowPresets

export function getTextColorFor(background: PaletteToken = "background"): string {
  return background === "dark" || background === "background" ? palette.medium : palette.dark
}

export function getSurfaceStyles(background: PaletteToken = "background") {
  return {
    backgroundColor: palette[background],
    color: getTextColorFor(background),
    boxShadow: shadowPresets.soft,
    borderRadius: "1.25rem",
  }
}
