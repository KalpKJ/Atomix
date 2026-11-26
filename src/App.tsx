import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { bySymbol, ELEMENTS, FAMILIES, search } from './elements.ts'
import ElementPanel from './ElementPanel.tsx'
import PeriodicTable from './PeriodicTable.tsx'
import type { Element, Family } from './types.ts'

/** The open element lives in the URL hash (#Fe), so every element has a shareable link. */
function fromHash(): Element | null {
  return bySymbol(decodeURIComponent(location.hash.slice(1))) ?? null
}

/** Below this width the details panel sits under the table instead of beside it. */
const STACKED = '(max-width: 72rem)'

export default function App() {
  const [selected, setSelected] = useState<Element | null>(fromHash)
  const [focused, setFocused] = useState<Element>(() => fromHash() ?? ELEMENTS[0])
  const [hovered, setHovered] = useState<Element | null>(null)
  const [query, setQuery] = useState('')
  const [family, setFamily] = useState<Family | null>(null)
  const panel = useRef<HTMLElement>(null)

  useEffect(() => {
    const sync = () => setSelected(fromHash())
    addEventListener('hashchange', sync)
    return () => removeEventListener('hashchange', sync)
  }, [])

  useEffect(() => {
    document.title = selected ? `${selected.name} · Atomix` : 'Atomix · an interactive periodic table'
  }, [selected])

  const show = useCallback((e: Element) => {
    setFocused(e)
    setSelected(e)
    // replaceState keeps Back from walking through every element you looked at.
    history.replaceState(null, '', `#${e.symbol}`)
  }, [])

  const open = useCallback(
    (e: Element) => {
      show(e)
      if (matchMedia(STACKED).matches) {
        requestAnimationFrame(() => panel.current?.scrollIntoView({ block: 'start' }))
      }
    },
    [show],
  )

  const close = useCallback(() => {
    history.replaceState(null, '', location.pathname + location.search)
    setSelected(null)
  }, [])

  const step = useCallback(
    (direction: -1 | 1) => {
      const next = selected && ELEMENTS[selected.number - 1 + direction]
      if (next) show(next)
    },
    [selected, show],
  )

  const results = useMemo(() => search(query), [query])
  const matches = useMemo(() => (query.trim() ? new Set(results.map((e) => e.number)) : null), [query, results])

  return (
    <div className="page">
      <header className="masthead">
        <h1>Atomix</h1>
        <p className="lead">
          An interactive periodic table. Open any of the 118 elements to read about it and turn its atom in 3D; each
          model is drawn from the element’s real electron shells.
        </p>
      </header>

      <div className="tools">
        <form
          className="search"
          role="search"
          onSubmit={(event) => {
            event.preventDefault()
            if (results[0]) open(results[0])
          }}
        >
          <label htmlFor="search">Find an element</label>
          <input
            id="search"
            type="search"
            value={query}
            placeholder="Name, symbol or number"
            autoComplete="off"
            spellCheck={false}
            onChange={(event) => setQuery(event.target.value)}
          />
          <p className="search__status" aria-live="polite">
            {query.trim() &&
              (results.length === 0
                ? 'No element matches that.'
                : `${results.length} match${results.length === 1 ? '' : 'es'}. Enter opens ${results[0].name}.`)}
          </p>
        </form>

        <fieldset className="legend">
          <legend>Highlight a family</legend>
          <div className="legend__items">
            {FAMILIES.map((f) => (
              <button
                key={f.id}
                type="button"
                data-family={f.id}
                aria-pressed={family === f.id}
                onClick={() => setFamily((current) => (current === f.id ? null : f.id))}
              >
                <i aria-hidden="true" />
                {f.label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="workspace">
        <main className="scroller" aria-describedby="scroll-hint">
          <p id="scroll-hint" className="scroll-hint">
            Scroll sideways to see the whole table.
          </p>
          <PeriodicTable
            focused={focused}
            preview={hovered ?? selected ?? focused}
            selected={selected}
            matches={matches}
            family={family}
            onFocus={setFocused}
            onHover={setHovered}
            onOpen={open}
          />
        </main>
        <ElementPanel ref={panel} element={selected} onClose={close} onStep={step} />
      </div>

      <footer className="foot">
        <p>
          Element data from{' '}
          <a href="https://github.com/Bowserinator/Periodic-Table-JSON" target="_blank" rel="noreferrer">
            Periodic-Table-JSON
          </a>
          , summaries from Wikipedia (CC BY-SA 4.0). The atoms follow the Bohr model, the textbook picture of electrons
          on rings; real electrons sit in fuzzier orbitals.
        </p>
        <p>
          Atomix started as a one-day team project with Aum Patel and Ohang Patel and was later rebuilt.{' '}
          <a href="https://github.com/KalpKJ/Atomix" target="_blank" rel="noreferrer">
            Code on GitHub
          </a>
        </p>
      </footer>
    </div>
  )
}
