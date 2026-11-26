export type Family =
  | 'alkali-metal'
  | 'alkaline-earth-metal'
  | 'transition-metal'
  | 'post-transition-metal'
  | 'metalloid'
  | 'nonmetal'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide'
  | 'unknown'

export interface Element {
  number: number
  symbol: string
  name: string
  family: Family
  /** The dataset's own wording, e.g. "diatomic nonmetal". */
  category: string
  /** Column 1–18 in the standard layout. */
  x: number
  /** Row 1–7, then 9 and 10 for the lanthanide and actinide rows. */
  y: number
  period: number
  group: number
  block: string
  phase: string
  /** Standard atomic weight in u. */
  mass: number
  /** Electrons in each shell, innermost first. */
  shells: number[]
  configuration: string
  electronegativity: number | null
  /** Kelvin. */
  melt: number | null
  /** Kelvin. */
  boil: number | null
  /** g/cm³. */
  density: number | null
  discoveredBy: string | null
  appearance: string | null
  /** Three sentences from Wikipedia. */
  summary: string
  /** The Wikipedia page the summary comes from. */
  source: string
}
