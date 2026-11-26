// Builds src/data/elements.json from Bowserinator/Periodic-Table-JSON, pinned to
// one commit so the output never changes under us. Run with `npm run data`.
//
// Facts come from that dataset; each summary is from Wikipedia (CC BY-SA), and
// the element's Wikipedia page is kept in `source` so the app can credit it.
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const COMMIT = process.env.DATA_COMMIT ?? 'a4859536499c2cb7ddf2666d8273e4ec98084d0a'
const URL = `https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/${COMMIT}/PeriodicTableJSON.json`
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'elements.json')

interface Raw {
  name: string
  symbol: string
  number: number
  category: string
  xpos: number
  ypos: number
  period: number
  group: number
  block: string
  phase: string
  atomic_mass: number
  shells: number[]
  electron_configuration_semantic: string
  electronegativity_pauling: number | null
  melt: number | null
  boil: number | null
  /** Always g/cm³; the plain `density` field switches to g/L for gases. */
  density_g_cm3: number | null
  discovered_by: string | null
  appearance: string | null
  summary: string
  source: string
}

/** The dataset's 17 category strings, folded into the ten groups the legend shows. */
export function family(category: string): string {
  const c = category.toLowerCase()
  if (c.includes('unknown')) return 'unknown'
  if (c.includes('alkali metal')) return 'alkali-metal'
  if (c.includes('alkaline earth')) return 'alkaline-earth-metal'
  if (c.includes('lanthanide')) return 'lanthanide'
  if (c.includes('actinide')) return 'actinide'
  // Before "transition metal", which "post-transition metal" also contains.
  if (c.includes('post-transition')) return 'post-transition-metal'
  if (c.includes('transition metal')) return 'transition-metal'
  if (c.includes('metalloid')) return 'metalloid'
  if (c.includes('noble gas')) return 'noble-gas'
  if (c.includes('nonmetal')) return 'nonmetal'
  return 'unknown'
}

const round = (n: number | null, places: number) => (n == null ? null : Number(n.toFixed(places)))

async function main() {
  const res = await fetch(URL)
  if (!res.ok) throw new Error(`${res.status} fetching ${URL}`)
  const { elements } = (await res.json()) as { elements: Raw[] }

  // The dataset also lists element 119, which has not been made yet.
  const out = elements
    .filter((e) => e.number <= 118)
    .map((e) => ({
      number: e.number,
      symbol: e.symbol,
      name: e.name,
      family: family(e.category),
      category: e.category,
      x: e.xpos,
      y: e.ypos,
      period: e.period,
      group: e.group,
      block: e.block,
      phase: e.phase,
      mass: round(e.atomic_mass, 3),
      shells: e.shells,
      configuration: e.electron_configuration_semantic,
      electronegativity: e.electronegativity_pauling,
      melt: round(e.melt, 1),
      boil: round(e.boil, 1),
      density: e.density_g_cm3,
      discoveredBy: e.discovered_by,
      appearance: e.appearance,
      summary: e.summary,
      source: e.source,
    }))

  if (out.length !== 118) throw new Error(`Expected 118 elements, got ${out.length}`)
  mkdirSync(dirname(OUT), { recursive: true })
  writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n')
  console.log(`Wrote ${out.length} elements from ${COMMIT} to ${OUT}`)
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  await main()
}
