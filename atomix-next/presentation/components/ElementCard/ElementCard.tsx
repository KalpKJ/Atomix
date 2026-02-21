"use client";

import { ElementData } from "@/domain/models/element.model";
import { useElementModal } from "@/application/hooks/useElementModal";
import ModelViewer from "@/presentation/components/ModelViewer/ModelViewer";

interface ElementCardProps {
  element: ElementData;
}

export default function ElementCard({ element }: ElementCardProps) {
  const { isModalOpen, openModal, closeModal } = useElementModal();

  return (
    <>
      <div
        onClick={openModal}
        className="bg-slate-900 border border-slate-700 rounded cursor-pointer 
                   hover:border-blue-500 hover:scale-105 transition-all group text-center
                   w-14 h-14 flex flex-col items-center justify-center p-0.5"
      >
        <span className="text-xs text-slate-500 font-bold block leading-tight text-center">
          {element.number.toString().padStart(2, '0')}
        </span>
        <h2 className="text-sm font-black text-white group-hover:text-blue-400 transition-colors leading-tight truncate w-full">
          {element.symbol}
        </h2>
      </div>

      {isModalOpen && (
        <ModelViewer element={element} onClose={closeModal} />
      )}
    </>
  );
}
