import React from "react";

type SingleItemDeleteProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
};

export default function SingleItemDelete({
  isOpen,
  onClose
}: SingleItemDeleteProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 font-raleway p-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 dark:bg-white">
        <h2 className="text-lg font-semibold dark:text-black text-center md:text-start">
          Não é possível excluir o único item restante!
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-600 text-center md:text-start">
          Se você deseja realmente excluir, clique na lixeira para deletar a
          compra inteira.
        </p>
        <div className="mt-4 flex justify-end md:space-x-2 flex-col md:flex-row space-y-4 md:space-y-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-darkerCustomColor hover:text-white transition w-full md:w-fit"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}
