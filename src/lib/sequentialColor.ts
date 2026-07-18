import { interpolateRgbBasis } from 'd3'

/**
 * Single-hue sequential ramp anchored on the site's brand red (#bf141c),
 * derived at the same OKLCH lightness/chroma steps as a validated blue
 * reference ramp, re-hued to 26.7° (see dataviz skill: "swap the reference
 * palette's values for your brand's").
 *
 * Light mode: near-zero recedes toward the light surface (lightest first).
 * Dark mode "flips anchor" per the sequential-color rule: near-zero recedes
 * toward the dark surface instead, so the stops are reversed.
 */
const LIGHT_MODE_STOPS = [
  '#ffd4ce',
  '#fbc0b8',
  '#faa9a0',
  '#f59489',
  '#f17c72',
  '#ea655c',
  '#e54640',
  '#d53230',
  '#be2b2a',
  '#aa2020',
  '#941a1b',
  '#7f1012',
  '#6a0c0e',
]

const DARK_MODE_STOPS = [...LIGHT_MODE_STOPS].reverse()

export function sequentialRed(t: number, mode: 'light' | 'dark'): string {
  const clamped = Math.min(1, Math.max(0, t))
  const stops = mode === 'dark' ? DARK_MODE_STOPS : LIGHT_MODE_STOPS
  return interpolateRgbBasis(stops)(clamped)
}
