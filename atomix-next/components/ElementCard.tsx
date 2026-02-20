"use client";

import { ElementData } from "@/types/element";
import { useState } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": {
        src?: string;
        "auto-rotate"?: boolean;
        "camera-controls"?: boolean;
        "shadow-intensity"?: string;
        className?: string;
        children?: React.ReactNode;
      } & React.HTMLAttributes<HTMLElement>;
    }
  }
}

interface ElementCardProps {
  element: ElementData;
}

export default function ElementCard({ element }: ElementCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="bg-slate-900 border border-slate-800 p-8 rounded-2xl cursor-pointer 
                   hover:border-blue-500 hover:scale-105 transition-all group text-center"
      >
        <span className="text-sm text-slate-500 font-bold block mb-2">
          {element.number.toString().padStart(2, '0')}
        </span>
        <h2 className="text-4xl font-black text-white group-hover:text-blue-400 transition-colors">
          {element.symbol}
        </h2>
        <p className="text-slate-400 font-medium mt-1">{element.name}</p>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center z-50 p-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-8 right-8 text-slate-400 hover:text-white text-xl font-bold"
          >
            ✕ Close
          </button>

          <div className="w-full max-w-3xl aspect-square lg:aspect-video bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl relative">
            <model-viewer
              src={element.bohr_model_3d}
              auto-rotate
              camera-controls
              shadow-intensity="1"
              className="w-full h-full outline-none"
            />
            <div className="absolute bottom-8 left-8">
              <h2 className="text-4xl font-bold">{element.name}</h2>
              <p className="text-blue-400 font-mono tracking-widest uppercase">
                Atomic Number: {element.number} | {element.symbol}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}