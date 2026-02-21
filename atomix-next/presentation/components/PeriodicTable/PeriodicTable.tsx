"use client";

import { ElementData } from "@/domain/models/element.model";
import ElementCard from "@/presentation/components/ElementCard/ElementCard";

interface PeriodicTableProps {
  elements: ElementData[];
}

export default function PeriodicTable({ elements }: PeriodicTableProps) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Navigation bar space */}
      <nav className="h-16 border-b border-slate-800 flex items-center px-6">
        <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          ATOMIC ATLAS
        </h1>
      </nav>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 overflow-auto">
        <div className="mb-2">
          <p className="text-xs text-slate-400">Interactive 3D Periodic Table</p>
        </div>
        
        {/* Periodic table grid */}
        <div 
          className="inline-grid gap-0.5"
          style={{
            gridTemplateColumns: `repeat(18, minmax(0, 1fr))`,
            gridAutoRows: 'auto',
            width: 'fit-content'
          }}
        >
          {elements.map((element) => (
            <div
              key={element.number}
              style={{
                gridColumn: element.xpos,
                gridRow: element.ypos,
              }}
            >
              <ElementCard element={element} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
