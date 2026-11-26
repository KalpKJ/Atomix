import { forwardRef, lazy, Suspense } from 'react'
import { FAMILIES, kelvinToCelsius } from './elements.ts'
import type { Element } from './types.ts'

// Three.js is the heaviest part of the app, so it loads only when an element opens.
const BohrModel = lazy(() => import('./BohrModel.tsx'))

interface Props {
  element: Element | null
  onClose: () => void
  onStep: (direction: -1 | 1) => void
}

function temperature(k: number | null) {
  if (k == null) return 'Unknown'
  return `${kelvinToCelsius(k).toLocaleString('en-CA')} °C (${k.toLocaleString('en-CA')} K)`
}

/** Details for the open element, beside the table on wide screens and below it on narrow ones. */
const ElementPanel = forwardRef<HTMLElement, Props>(function ElementPanel({ element, onClose, onStep }, ref) {
  if (!element) {
    return (
      <aside ref={ref} className="panel panel--empty" aria-label="Element details">
        <p className="panel__hint">
          Pick an element to see its atom in 3D, a short history and its key numbers. You can also type a name above, or
          use the arrow keys in the table.
        </p>
      </aside>
    )
  }

  const family = FAMILIES.find((f) => f.id === element.family)

  return (
    <aside ref={ref} className="panel" aria-labelledby="panel-title" data-family={element.family}>
      <header className="panel__head">
        <div className="panel__nav">
          <button type="button" onClick={() => onStep(-1)} disabled={element.number === 1} aria-label="Previous element">
            <span aria-hidden="true">←</span>
          </button>
          <button type="button" onClick={() => onStep(1)} disabled={element.number === 118} aria-label="Next element">
            <span aria-hidden="true">→</span>
          </button>
          <button type="button" onClick={onClose} aria-label="Close details">
            <span aria-hidden="true">✕</span>
          </button>
        </div>
        <p className="panel__symbol" aria-hidden="true">
          {element.symbol}
        </p>
        <div className="panel__title">
          <h2 id="panel-title" aria-live="polite">
            {element.name}
          </h2>
          <p className="panel__kind">
            {element.number} · {family?.one ?? element.category}
          </p>
        </div>
      </header>

      <Suspense fallback={<div className="bohr bohr--loading" />}>
        <BohrModel element={element} />
      </Suspense>

      <p className="panel__summary">{element.summary}</p>
      <p className="panel__credit">
        From{' '}
        <a href={element.source} target="_blank" rel="noreferrer">
          Wikipedia
        </a>
        , CC BY-SA 4.0
      </p>

      <dl className="facts">
        <div>
          <dt>Atomic weight</dt>
          <dd>{element.mass} u</dd>
        </div>
        <div>
          <dt>Phase at STP</dt>
          <dd>{element.phase}</dd>
        </div>
        <div className="facts__wide">
          <dt>Electron configuration</dt>
          <dd className="mono">{element.configuration}</dd>
        </div>
        <div>
          <dt>Melts at</dt>
          <dd>{temperature(element.melt)}</dd>
        </div>
        <div>
          <dt>Boils at</dt>
          <dd>{temperature(element.boil)}</dd>
        </div>
        <div>
          <dt>Density</dt>
          <dd>{element.density == null ? 'Unknown' : `${element.density} g/cm³`}</dd>
        </div>
        <div>
          <dt>Electronegativity</dt>
          <dd>{element.electronegativity ?? 'Unknown'}</dd>
        </div>
        <div className="facts__wide">
          <dt>Discovered by</dt>
          <dd>{element.discoveredBy ?? 'Unknown'}</dd>
        </div>
      </dl>
    </aside>
  )
})

export default ElementPanel
