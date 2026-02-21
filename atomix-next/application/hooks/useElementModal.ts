"use client";

import { useState } from "react";

export function useElementModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const toggleModal = () => setIsModalOpen(prev => !prev);

  return {
    isModalOpen,
    openModal,
    closeModal,
    toggleModal,
  };
}
