import { memo, useRef, type KeyboardEvent } from 'react'
import { ELEMENTS, FAMILIES, neighbour, type Direction } from './elements.ts'
import type { Element, Family } from './types.ts'

const KEYS: Record<string, Direction> = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
}

interface Props {
  /** The element keyboard focus rests on (one tab stop for the whole table). */
  focused: Element
  /** The element under the pointer, shown in the key. */
  preview: Element
  selected: Element | null
  /** Elements matching the search; null when nothing is being searched. */
  matches: Set<number> | null
  family: Family | null
  onFocus: (element: Element) => void
  onHover: (element: Element | null) => void
  onOpen: (element: Element) => void
}

/** The 118 elements in the standard 18-column layout, one button each. */
function PeriodicTable({ focused, preview, selected, matches, family, onFocus, onHover, onOpen }: Props) {
  const cells = useRef(new Map<number, HTMLButtonElement>())

  const move = (event: KeyboardEvent, from: Element) => {
    const direction = KEYS[event.key]
    if (!direction) return
    event.preventDefault()
    const next = neighbour(from, direction)
    onFocus(next)
    cells.current.get(next.number)?.focus()
  }

  return (
    <div
      className="table"
      role="group"
      aria-label="Periodic table. Use the arrow keys to move between elements and Enter to open one."
      onMouseLeave={() => onHover(null)}
    >
      {/* The empty space above the transition metals holds a key for the element under the pointer. */}
      <div className="key" aria-hidden="true" data-family={preview.family}>
        <span className="key__number">{preview.number}</span>
        <span className="key__symbol">{preview.symbol}</span>
        <span className="key__name">{preview.name}</span>
        <span className="key__mass">{preview.mass}</span>
        <span className="key__family">{FAMILIES.find((f) => f.id === preview.family)?.one}</span>
      </div>

      {ELEMENTS.map((e) => {
        const dim = (matches !== null && !matches.has(e.number)) || (family !== null && e.family !== family)
        return (
          <button
            key={e.number}
            ref={(node) => {
              if (node) cells.current.set(e.number, node)
              else cells.current.delete(e.number)
            }}
            type="button"
            className="cell"
            data-family={e.family}
            data-dim={dim || undefined}
            aria-pressed={selected?.number === e.number}
            aria-label={`${e.name}, ${e.number}`}
            tabIndex={focused.number === e.number ? 0 : -1}
            style={{ gridColumn: e.x, gridRow: e.y }}
            onClick={() => onOpen(e)}
            onFocus={() => onFocus(e)}
            onMouseEnter={() => onHover(e)}
            onKeyDown={(event) => move(event, e)}
          >
            <span className="cell__number">{e.number}</span>
            <span className="cell__symbol">{e.symbol}</span>
            <span className="cell__name">{e.name}</span>
          </button>
        )
      })}

      <span className="table__gap" aria-hidden="true" style={{ gridColumn: 3, gridRow: 6 }}>
        57–71
      </span>
      <span className="table__gap" aria-hidden="true" style={{ gridColumn: 3, gridRow: 7 }}>
        89–103
      </span>
    </div>
  )
}

export default memo(PeriodicTable)
