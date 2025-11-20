const DESKTOP_PADDING = 32
const DEFAULT_GRID = 80

export interface ViewportRect {
  width: number
  height: number
}

export interface WindowPosition {
  x: number
  y: number
}

export interface WindowSize {
  width: number
  height: number
}

export function getViewportRect(): ViewportRect {
  if (typeof window === "undefined") {
    return { width: 1280, height: 720 }
  }
  return { width: window.innerWidth, height: window.innerHeight }
}

export function clampPosition(position: WindowPosition, size: WindowSize, viewport = getViewportRect()): WindowPosition {
  const maxX = Math.max(DESKTOP_PADDING, viewport.width - size.width - DESKTOP_PADDING)
  const maxY = Math.max(DESKTOP_PADDING, viewport.height - size.height - DESKTOP_PADDING)
  return {
    x: Math.min(Math.max(position.x, DESKTOP_PADDING), maxX),
    y: Math.min(Math.max(position.y, DESKTOP_PADDING + 48), maxY),
  }
}

export function snapToGrid(value: number, grid = DEFAULT_GRID) {
  return Math.round(value / grid) * grid
}

export function snapPosition(position: WindowPosition, grid = DEFAULT_GRID): WindowPosition {
  return {
    x: snapToGrid(position.x, grid),
    y: snapToGrid(position.y, grid),
  }
}

export function cascadePosition(index: number): WindowPosition {
  const offset = 32
  return {
    x: DESKTOP_PADDING + index * offset,
    y: DESKTOP_PADDING + index * offset,
  }
}

export function constrainSize(size: WindowSize, viewport = getViewportRect()): WindowSize {
  const minWidth = 320
  const minHeight = 220
  const maxWidth = viewport.width - DESKTOP_PADDING * 2
  const maxHeight = viewport.height - DESKTOP_PADDING * 2
  return {
    width: Math.min(Math.max(size.width, minWidth), maxWidth),
    height: Math.min(Math.max(size.height, minHeight), maxHeight),
  }
}

export function pointerDelta(event: PointerEvent): { dx: number; dy: number } {
  return {
    dx: event.movementX ?? 0,
    dy: event.movementY ?? 0,
  }
}
