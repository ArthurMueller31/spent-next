import React from "react";

type ConfirmDeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
};

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 font-raleway p-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 dark:bg-white">
        <h2 className="text-lg font-semibold dark:text-black text-center md:text-start">
          Tem certeza que deseja excluir a compra inteira?
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-600 text-center md:text-start">
          Essa ação é irreversível.
        </p>
        <div className="mt-4 flex justify-end md:space-x-2 flex-col md:flex-row space-y-4 md:space-y-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition w-full md:w-fit"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition w-full md:w-fit"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
