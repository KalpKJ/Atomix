import data from './data/elements.json'
import type { Element, Family } from './types.ts'

export const ELEMENTS = data as Element[]

export const FAMILIES: { id: Family; label: string; one: string }[] = [
  { id: 'alkali-metal', label: 'Alkali metals', one: 'Alkali metal' },
  { id: 'alkaline-earth-metal', label: 'Alkaline earth metals', one: 'Alkaline earth metal' },
  { id: 'transition-metal', label: 'Transition metals', one: 'Transition metal' },
  { id: 'post-transition-metal', label: 'Post-transition metals', one: 'Post-transition metal' },
  { id: 'metalloid', label: 'Metalloids', one: 'Metalloid' },
  { id: 'nonmetal', label: 'Nonmetals', one: 'Nonmetal' },
  { id: 'noble-gas', label: 'Noble gases', one: 'Noble gas' },
  { id: 'lanthanide', label: 'Lanthanides', one: 'Lanthanide' },
  { id: 'actinide', label: 'Actinides', one: 'Actinide' },
  { id: 'unknown', label: 'Unknown properties', one: 'Properties not yet known' },
]

const BY_SYMBOL = new Map(ELEMENTS.map((e) => [e.symbol.toLowerCase(), e]))
const BY_CELL = new Map(ELEMENTS.map((e) => [`${e.x},${e.y}`, e]))

export function bySymbol(symbol: string): Element | undefined {
  return BY_SYMBOL.get(symbol.trim().toLowerCase())
}

/**
 * Elements matching a search, best first: exact symbol, then exact number,
 * then names and symbols that start with the query, then names containing it.
 */
export function search(query: string): Element[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const score = (e: Element) => {
    const name = e.name.toLowerCase()
    const symbol = e.symbol.toLowerCase()
    if (symbol === q) return 0
    if (String(e.number) === q) return 0
    if (name === q) return 1
    if (symbol.startsWith(q)) return 2
    if (name.startsWith(q)) return 3
    if (name.includes(q)) return 4
    return -1
  }
  return ELEMENTS.map((e) => [e, score(e)] as const)
    .filter(([, s]) => s >= 0)
    .sort((a, b) => a[1] - b[1] || a[0].number - b[0].number)
    .map(([e]) => e)
}

export type Direction = 'left' | 'right' | 'up' | 'down'

/**
 * The element an arrow key moves to from `from`. Moves skip the gaps in the
 * table: left and right find the next element along the row, up and down find
 * the nearest element in the column, so every element is reachable.
 */
export function neighbour(from: Element, direction: Direction): Element {
  const rows = [1, 2, 3, 4, 5, 6, 7, 9, 10]
  if (direction === 'left' || direction === 'right') {
    const step = direction === 'right' ? 1 : -1
    for (let x = from.x + step; x >= 1 && x <= 18; x += step) {
      const hit = BY_CELL.get(`${x},${from.y}`)
      if (hit) return hit
    }
    return from
  }
  const step = direction === 'down' ? 1 : -1
  for (let i = rows.indexOf(from.y) + step; i >= 0 && i < rows.length; i += step) {
    // Nearest element in that row, preferring the same column.
    for (let dx = 0; dx < 18; dx++) {
      const hit = BY_CELL.get(`${from.x - dx},${rows[i]}`) ?? BY_CELL.get(`${from.x + dx},${rows[i]}`)
      if (hit) return hit
    }
  }
  return from
}

export function kelvinToCelsius(k: number): number {
  return Math.round((k - 273.15) * 10) / 10
}

/** "2, 8, 14, 2" read aloud as a sentence for the 3D model's label. */
export function describeShells(e: Element): string {
  const n = e.shells.length
  return `${e.name} has ${e.number} electron${e.number === 1 ? '' : 's'} in ${n} shell${n === 1 ? '' : 's'}: ${e.shells.join(', ')}.`
}

/** Neutrons in the most common isotope, estimated from the rounded atomic weight. */
export function neutrons(e: Element): number {
  return Math.max(0, Math.round(e.mass) - e.number)
}
