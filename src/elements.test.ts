import { describe, expect, it } from 'vitest'
import { family } from '../scripts/build-data.ts'
import { bySymbol, describeShells, ELEMENTS, kelvinToCelsius, neighbour, neutrons, search } from './elements.ts'

const el = (symbol: string) => {
  const e = bySymbol(symbol)
  if (!e) throw new Error(`No element ${symbol}`)
  return e
}

describe('data', () => {
  it('has all 118 elements, in order, with shells that add up', () => {
    expect(ELEMENTS).toHaveLength(118)
    ELEMENTS.forEach((e, i) => {
      expect(e.number).toBe(i + 1)
      expect(e.shells.reduce((a, b) => a + b, 0)).toBe(e.number)
    })
  })

  it('puts every element in its own cell', () => {
    const cells = new Set(ELEMENTS.map((e) => `${e.x},${e.y}`))
    expect(cells.size).toBe(118)
  })

  it('sorts the dataset categories into families', () => {
    expect(family('post-transition metal')).toBe('post-transition-metal')
    expect(family('transition metal')).toBe('transition-metal')
    expect(family('diatomic nonmetal')).toBe('nonmetal')
    expect(family('unknown, probably transition metal')).toBe('unknown')
    expect(el('Al').family).toBe('post-transition-metal')
    expect(el('Fe').family).toBe('transition-metal')
    expect(el('He').family).toBe('noble-gas')
  })
})

describe('search', () => {
  it('ranks an exact symbol or number first', () => {
    expect(search('fe')[0].name).toBe('Iron')
    expect(search('26')[0].name).toBe('Iron')
    expect(search('C')[0].name).toBe('Carbon')
  })

  it('finds names by prefix and by part', () => {
    expect(search('oxy')[0].name).toBe('Oxygen')
    expect(search('gen').map((e) => e.name)).toContain('Hydrogen')
    expect(search('   ')).toEqual([])
    expect(search('zzz')).toEqual([])
  })
})

describe('arrow keys', () => {
  it('skips gaps along a row', () => {
    expect(neighbour(el('H'), 'right').symbol).toBe('He')
    expect(neighbour(el('He'), 'left').symbol).toBe('H')
    expect(neighbour(el('Be'), 'right').symbol).toBe('B')
  })

  it('moves to the nearest element in the next row', () => {
    expect(neighbour(el('H'), 'down').symbol).toBe('Li')
    expect(neighbour(el('Sc'), 'up').symbol).toBe('Mg')
    expect(neighbour(el('Ra'), 'down').symbol).toBe('La')
    expect(neighbour(el('Ce'), 'up').symbol).toBe('Rf')
  })

  it('stays put at the edges', () => {
    expect(neighbour(el('H'), 'up').symbol).toBe('H')
    expect(neighbour(el('Og'), 'right').symbol).toBe('Og')
    expect(neighbour(el('Lr'), 'down').symbol).toBe('Lr')
  })
})

describe('helpers', () => {
  it('converts kelvin to celsius', () => {
    expect(kelvinToCelsius(273.15)).toBe(0)
    expect(kelvinToCelsius(373.1)).toBe(100)
  })

  it('estimates neutrons and describes shells', () => {
    expect(neutrons(el('C'))).toBe(6)
    expect(neutrons(el('Fe'))).toBe(30)
    expect(describeShells(el('H'))).toBe('Hydrogen has 1 electron in 1 shell: 1.')
    expect(describeShells(el('Fe'))).toBe('Iron has 26 electrons in 4 shells: 2, 8, 14, 2.')
  })
})
