import React from "react";

type EmptyUsernameModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
};

export default function EmptyUsernameModal({
  isOpen,
  onClose
}: EmptyUsernameModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 font-raleway p-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 dark:bg-white">
        <h2 className="text-lg font-semibold dark:text-black text-center md:text-start">
          Não é possível deixar o campo vazio!
        </h2>
        <div className="mt-4 flex justify-end md:space-x-2 flex-col md:flex-row space-y-4 md:space-y-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-darkerCustomColor hover:text-white transition w-full md:w-fit"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
