"use client";

import React from "react";
import { ElementData } from "@/domain/models/element.model";

interface ModelViewerProps {
  element: ElementData;
  onClose: () => void;
}

export default function ModelViewer({ element, onClose }: ModelViewerProps) {
  return (
    <div
      className="fixed inset-0 backdrop-blur-md flex flex-col items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(39, 40, 38, 0.95)" }}
    >
      <button
        onClick={onClose}
        className="absolute top-8 right-8 text-xl font-bold hover:scale-110 transition-transform"
        style={{ color: "#ff5333" }}
      >
        ✕ Close
      </button>

      <div
        className="w-full max-w-3xl aspect-square lg:aspect-video rounded-3xl border-2 shadow-2xl relative overflow-hidden"
        style={{
          backgroundColor: "#1a1a18",
          borderColor: "#ff5333",
          boxShadow: "0 0 60px rgba(255, 83, 51, 0.3)",
        }}
      >
        <model-viewer
          src={element.bohr_model_3d}
          auto-rotate
          camera-controls
          shadow-intensity="1"
          className="w-full h-full outline-none"
          style={{ backgroundColor: "transparent" }}
        />
        <div 
          className="absolute bottom-8 left-8 bg-black/60 rounded-xl p-6"
          style={{ backdropFilter: "blur(10px)" }}
        >
          <h2 className="text-4xl font-bold mb-2" style={{ color: "#ff5333" }}>
            {element.name}
          </h2>
          <p
            className="font-mono tracking-widest text-sm"
            style={{ color: "#b5b1a7" }}
          >
            Atomic #{element.number} | {element.symbol}
          </p>
          {element.electron_configuration && (
            <p
              className="font-mono text-xs mt-2"
              style={{ color: "#b5b1a7", opacity: 0.8 }}
            >
              {element.electron_configuration}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
