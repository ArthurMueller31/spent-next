import { useState } from "react";
import { firestore } from "../../../../firebase/firebase";
import { getAuth } from "firebase/auth";
import { collection, addDoc, doc } from "firebase/firestore";
import { format, toZonedTime } from "date-fns-tz";

type AddProductsProps = {
  isModalOpen: boolean;
  handleModalToggle: () => void;
};

export default function AddProductsModal({
  isModalOpen,
  handleModalToggle
}: AddProductsProps) {
  const [formData, setFormData] = useState({
    purchaseDate: "",
    establishment: "",
    items: [{ name: "", price: "", quantity: "", weight: "" }]
  });

  // arruma a hora no firestore
  const timeZone = "America/Sao_Paulo";
  const formattedDate = format(
    toZonedTime(new Date(), timeZone),
    "yyyy-MM-dd'T'HH:mm:ssXXX",
    {
      timeZone
    }
  );

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { name: "", price: "", quantity: "", weight: "" }]
    }));
  };

  const handleChangeItem = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedItems = [...prev.items];
      // updatedItems é array, cada el tem o tipo string; updatedItems[number] refere à um item da lista, keyof pega as chaves; name as keyof... garante pro ts que valor de name será uma das chaves válidas
      updatedItems[index][name as keyof (typeof updatedItems)[number]] = value;
      return { ...prev, items: updatedItems };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        // não ter possibilidade de ser null
        return;
      }

      const userId = user.uid;
      const userRef = doc(firestore, "users", userId);
      const purchasesRef = collection(userRef, "purchases");

      const docRef = await addDoc(purchasesRef, {
        ...formData,
        createdAt: formattedDate
      });

      console.log("Compra adicionada com ID: ", docRef.id);
    } catch (error) {
      console.error("Erro ao add compra: ", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
      <div
        className={`bg-white p-8 rounded-lg shadow-lg relative transition-transform duration-300 ${
          isModalOpen ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      >
        <form onSubmit={handleSubmit}>
          {/* Compra do dia e Local */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="purchaseDate"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Compra do dia
              </label>
              <input
                type="date"
                name="purchaseDate"
                id="purchaseDate"
                value={formData.purchaseDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    purchaseDate: e.target.value
                  }))
                }
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="establishment"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Local da Compra
              </label>
              <input
                type="text"
                name="establishment"
                id="establishment"
                value={formData.establishment}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    establishment: e.target.value
                  }))
                }
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Ex: Mercado X"
                required
              />
            </div>
          </div>

          {/* Itens da compra */}
          <div className="mt-4">
            {formData.items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-4 items-center mb-4"
              >
                <div>
                  <label
                    htmlFor={`name-${index}`}
                    className="block mb-2 text-sm font-medium"
                  >
                    Nome do Item
                  </label>
                  <input
                    type="text"
                    name="name"
                    id={`name-${index}`}
                    value={item.name || ""}
                    onChange={(e) => handleChangeItem(index, e)}
                    className="bg-gray-50 border text-sm rounded-lg block w-full p-2.5"
                    placeholder="Ex: Arroz"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor={`price-${index}`}
                    className="block mb-2 text-sm font-medium"
                  >
                    Preço
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    id={`price-${index}`}
                    value={item.price || ""}
                    onChange={(e) => handleChangeItem(index, e)}
                    className="bg-gray-50 border text-sm rounded-lg block w-full p-2.5"
                    placeholder="Ex: 19.90"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor={`quantity-${index}`}
                    className="block mb-2 text-sm font-medium"
                  >
                    Quantidade
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    id={`quantity-${index}`}
                    value={item.quantity || ""}
                    onChange={(e) => handleChangeItem(index, e)}
                    className="bg-gray-50 border text-sm rounded-lg block w-full p-2.5"
                    placeholder="Ex: 2"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor={`weight-${index}`}
                    className="block mb-2 text-sm font-medium"
                  >
                    Peso (g)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    id={`weight-${index}`}
                    value={item.weight || ""}
                    onChange={(e) => handleChangeItem(index, e)}
                    className="bg-gray-50 border text-sm rounded-lg block w-full p-2.5"
                    placeholder="Ex: 1000"
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={handleAddItem}
              className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 transition"
            >
              Adicionar mais itens
            </button>
            <button
              type="button"
              onClick={handleModalToggle}
              className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 transition"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
