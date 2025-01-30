import { useState } from "react";
import { updateDoc, doc } from "firebase/firestore";
import { firestore } from "../../../../firebase/firebase";

interface Item {
  name: string;
  price: string;
  quantity: string;
  weight: string;
}

interface Purchase {
  id: string;
  establishment: string;
  purchaseDate: string;
  items: Item[];
}

interface EditPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchase: Purchase | null;
  userId: string;
  onUpdate: (updatedPurchase: Purchase) => void;
}

const EditPurchaseModal: React.FC<EditPurchaseModalProps> = ({
  isOpen,
  onClose,
  purchase,
  userId,
  onUpdate
}) => {
  const [updatedPurchase, setUpdatedPurchase] = useState<Purchase | null>(
    purchase
  );
  // Purchase | null

  if (!isOpen || !updatedPurchase.id) return;

  const handleSave = async () => {
    if (!userId || !updatedPurchase.id) return;

    try {
      const purchaseRef = doc(
        firestore,
        `users/${userId}/purchases/${updatedPurchase.id}`
      );

      await updateDoc(purchaseRef, {
        establishment: updatedPurchase?.establishment,
        purchaseDate: updatedPurchase?.purchaseDate,
        items: updatedPurchase?.items
      });

      onUpdate(updatedPurchase); // atualizar ui com os dados novos
      onClose(); // fechar o modal
      alert("Compra editada com sucesso");
    } catch (error) {
      console.error("Erro ao editar:", error);
      alert("Erro ao editar. Tente novamente.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Editar Compra</h2>

        <label className="block mb-2">Local da Compra</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={updatedPurchase.establishment}
          onChange={(e) =>
            setUpdatedPurchase({
              ...updatedPurchase,
              establishment: e.target.value
            })
          }
        />

        <label className="block mt-3 mb-2">Data da Compra</label>
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={updatedPurchase.purchaseDate}
          onChange={(e) =>
            setUpdatedPurchase({
              ...updatedPurchase,
              purchaseDate: e.target.value
            })
          }
        />

        <div className="mt-4 flex justify-between">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleSave}
          >
            Salvar Alterações
          </button>

          <button className="text-red-500 px-4 py-2" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
