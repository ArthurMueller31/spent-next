import React, { useState, useEffect } from "react";
import { firestore } from "../../../../firebase/firebase";
import { getAuth } from "firebase/auth";
import { collection, addDoc, doc, getDocs } from "firebase/firestore";
import { format, toZonedTime } from "date-fns-tz";
import Image from "next/image";
import FutureDataSelectionModal from "./FutureDataSelectionModal";

interface PurchaseItem {
  name: string;
  price: string;
  quantity: string;
  weight: string;
  establishment: string;
}

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
    category: "Não especificado",
    items: [{ name: "", price: "", quantity: "", weight: "" }]
  });
  const [dateInputFocus, setDateInputFocus] = useState(false);

  const [previousItems, setPreviousItems] = useState<PurchaseItem[]>([]);
  const [previousEstablishments, setPreviousEstablishments] = useState<
    string[]
  >([]);

  const [establishmentCategories, setEstablishmentCategories] = useState<{
    [key: string]: string;
  }>({});
  const [filteredSuggestions, setFilteredSuggestions] = useState<
    PurchaseItem[][]
  >([]);
  const [hoveredItems, setHoveredItems] = useState<{
    [key: number]: { price: string; quantity: string; weight: string } | null;
  }>({});
  const [filteredEstablishments, setFilteredEstablishments] = useState<
    string[]
  >([]);
  const [showEstablishmentDropdown, setShowEstablishmentDropdown] =
    useState<boolean>(false);
  const [userSelectedFutureDataModalOpen, setUserSelectedFutureDataModalOpen] =
    useState(false);

  // arruma a hora no firestore
  const timeZone = "America/Sao_Paulo";
  const formattedDate = format(
    toZonedTime(new Date(), timeZone),
    "yyyy-MM-dd'T'HH:mm:ssXXX",
    {
      timeZone
    }
  );

  useEffect(() => {
    const fetchPreviousItems = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const userId = user.uid;
      const userRef = doc(firestore, "users", userId);
      const purchasesRef = collection(userRef, "purchases");

      const querySnapshot = await getDocs(purchasesRef);
      const itemsSet = new Set<string>(); // garante que item só aparece 1 vez
      const itemsArray: PurchaseItem[] = [];
      const establishmentSet = new Set<string>();
      const establishmentMap = new Map<string, string>();

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        if (data.establishment && data.category) {
          establishmentSet.add(data.establishment);
          establishmentMap.set(data.establishment, data.category);
        }

        if (data.items) {
          data.items.forEach((item: PurchaseItem) => {
            if (data.establishment && !itemsSet.has(item.name)) {
              itemsSet.add(item.name);
              itemsArray.push({ ...item, establishment: data.establishment });
            }
          });
        }
      });

      setPreviousItems(itemsArray);
      setPreviousEstablishments(Array.from(establishmentSet));
      setEstablishmentCategories(Object.fromEntries(establishmentMap));
    };

    if (isModalOpen) {
      fetchPreviousItems();
    }
  }, [isModalOpen]);

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { name: "", price: "", quantity: "", weight: "" }]
    }));

    setFilteredSuggestions((prev) => [...prev, []]);
  };

  const handleRemoveItem = (index: number) => {
    setFormData((prev) => {
      const updatedItems = prev.items.filter((_, i) => i !== index);
      return { ...prev, items: updatedItems };
    });
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

      // filtrar sugestões com base no que for digitado
      if (name === "name") {
        if (value.trim() === "") {
          setFilteredSuggestions((prev) => {
            const newSuggestions = [...prev];
            newSuggestions[index] = [];
            return newSuggestions;
          });
        } else {
          const filtered = previousItems.filter(
            (item) =>
              item.name.toLowerCase().includes(value.toLowerCase()) &&
              item.establishment.toLowerCase() ===
                formData.establishment.toLowerCase()
          );
          setFilteredSuggestions((prev) => {
            const newSuggestions = [...prev];
            newSuggestions[index] = filtered.length > 0 ? filtered : [];
            return newSuggestions;
          });
        }
      }

      return { ...prev, items: updatedItems };
    });
  };

  const handleSelectItem = (
    index: number,
    selectedItem: {
      name: string;
      price: string;
      quantity: string;
      weight: string;
    }
  ) => {
    setFormData((prev) => {
      const updatedItems = [...prev.items];

      updatedItems[index] = { ...selectedItem };
      return { ...prev, items: updatedItems };
    });

    setFilteredSuggestions((prev) => {
      const newSuggestions = [...prev];
      newSuggestions[index] = [];
      return newSuggestions;
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
    } finally {
      location.reload();
    }
  };

  const handleBlur = (index: number) => {
    setTimeout(() => {
      setFilteredSuggestions((prev) => {
        const newSuggestions = [...prev];
        newSuggestions[index] = [];
        return newSuggestions;
      });
      setHoveredItems([null]);
    }, 100);
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center overflow-auto bg-black bg-opacity-50 transition-opacity duration-300 z-40 font-workSans">
        <div
          className={`bg-gray-50 p-8 rounded-lg shadow-lg relative transition-transform duration-300 border-2 border-darkerCustomColor dark:bg-darkerCustomColor w-[80%] md:w-fit ${
            isModalOpen ? "opacity-100 scale-100" : "opacity-0 scale-90"
          } max-h-[80vh] overflow-auto`}
        >
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="purchaseDate"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Compra do dia
                </label>
                <input
                  type={dateInputFocus ? "date" : "text"}
                  onFocus={() => setDateInputFocus(true)}
                  onBlur={(e) =>
                    e.target.value === ""
                      ? setDateInputFocus(false)
                      : setDateInputFocus(true)
                  }
                  name="purchaseDate"
                  id="purchaseDate"
                  placeholder="Informe a data (Dia/Mês/Ano)"
                  value={formData.purchaseDate}
                  onChange={(e) => {
                    const selectedDate = e.target.value;
                    const today = new Date().toISOString().split("T")[0];

                    if (selectedDate > today) {
                      setUserSelectedFutureDataModalOpen(true);
                      return;
                    }
                    setFormData((prev) => ({
                      ...prev,
                      purchaseDate: e.target.value
                    }));
                  }}
                  className="bg-white border border-darkerCustomColor text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-600 dark:text-black dark:bg-white"
                  required
                />
              </div>
              <div className="relative">
                <label
                  htmlFor="establishment"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Local da Compra
                </label>
                <input
                  autoComplete="off"
                  type="text"
                  name="establishment"
                  id="establishment"
                  value={formData.establishment}
                  onFocus={() => {
                    setShowEstablishmentDropdown(true);

                    // vazio mostra sug.; filtra se tiver letras
                    if (!formData.establishment) {
                      setFilteredEstablishments(previousEstablishments);
                    } else {
                      setFilteredEstablishments(
                        previousEstablishments.filter((establishment) =>
                          establishment
                            .toLowerCase()
                            .includes(formData.establishment.toLowerCase())
                        )
                      );
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      setShowEstablishmentDropdown(false);
                    }, 100);
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      establishment: value
                    }));
                    setFilteredEstablishments(
                      previousEstablishments.filter((establishment) =>
                        establishment
                          .toLowerCase()
                          .includes(value.toLowerCase())
                      )
                    );

                    setShowEstablishmentDropdown(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      e.currentTarget.blur();
                      setShowEstablishmentDropdown(false);
                    }
                  }}
                  className="bg-white border border-darkerCustomColor text-gray-900 text-sm rounded-lg placeholder-gray-500 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-600 dark:text-black"
                  placeholder="Onde foi efetuada a compra?"
                  required
                />

                {showEstablishmentDropdown &&
                  filteredEstablishments.length > 0 && (
                    <ul className="absolute left-0 bg-white border border-gray-300 rounded shadow-md z-50 w-full max-h-24 overflow-y-auto">
                      {filteredEstablishments.map((est, i) => (
                        <li
                          key={i}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onMouseEnter={() => {
                            const categ = establishmentCategories[est];
                            if (categ) {
                              setFormData((prev) => ({
                                ...prev,
                                category: categ
                              }));
                            }
                          }}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setFormData((prev) => ({
                              ...prev,
                              establishment: est
                            }));

                            setShowEstablishmentDropdown(false);
                          }}
                        >
                          {est}
                        </li>
                      ))}
                    </ul>
                  )}
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Categoria
                </label>
                <select
                  name="category"
                  value={formData.category || "Não especificado"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value
                    }))
                  }
                  className="bg-white border border-darkerCustomColor text-gray-900 text-sm rounded-lg block w-full p-3 dark:bg-white dark:border-gray-600 dark:text-black"
                  required
                >
                  <option value="Não especificado" className="font-raleway">
                    Selecione uma categoria
                  </option>
                  <option value="Mercado" className="font-raleway">
                    Mercado
                  </option>
                  <option value="Lazer/Entretenimento" className="font-raleway">
                    Lazer/Entretenimento
                  </option>
                  <option
                    value="Eletrônicos/Tecnologia"
                    className="font-raleway"
                  >
                    Eletrônicos/Tecnologia
                  </option>
                  <option value="Casa/decoração" className="font-raleway">
                    Casa/decoração
                  </option>
                  <option value="Outro" className="font-raleway">
                    Outro
                  </option>
                </select>
              </div>
            </div>

            {/* Itens da compra */}
            <div className="mt-4">
              {formData.items.map((item, index) => (
                <React.Fragment key={index}>
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 items-center mb-4"
                  >
                    <div className="relative">
                      <label
                        htmlFor={`name-${index}`}
                        className="block mb-2 text-sm font-medium"
                      >
                        Nome do Item
                      </label>
                      <input
                        onBlur={() => handleBlur(index)}
                        autoComplete="off"
                        type="text"
                        placeholder="Pode conter espaços"
                        name="name"
                        id={`name-${index}`}
                        value={item.name}
                        onChange={(e) => handleChangeItem(index, e)}
                        className="bg-white border border-darkerCustomColor text-sm rounded-lg block w-full p-2.5 placeholder-gray-500 dark:bg-white dark:placeholder:text-gray-600 dark:text-black"
                        required
                      />

                      {filteredSuggestions[index] &&
                        filteredSuggestions[index].length > 0 && (
                          <ul className="absolute left-0 bg-white border border-gray-300 rounded shadow-md z-50 w-full max-h-24 overflow-y-auto">
                            {filteredSuggestions[index].map((suggestion, j) => (
                              <li
                                key={j}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onMouseEnter={() =>
                                  setHoveredItems((prev) => ({
                                    ...prev,
                                    [index]: suggestion
                                  }))
                                }
                                onMouseLeave={() =>
                                  setHoveredItems((prev) => ({
                                    ...prev,
                                    [index]: null
                                  }))
                                }
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  handleSelectItem(index, suggestion);
                                }}
                                onClick={() =>
                                  handleSelectItem(index, suggestion)
                                }
                              >
                                {suggestion.name}
                              </li>
                            ))}
                          </ul>
                        )}
                    </div>

                    <div>
                      <label
                        htmlFor={`price-${index}`}
                        className="block mb-2 text-sm font-medium"
                      >
                        Preço
                      </label>
                      <input
                        autoComplete="off"
                        type="number"
                        step="0.01"
                        min={0}
                        name="price"
                        id={`price-${index}`}
                        value={item.price || ""}
                        onChange={(e) => handleChangeItem(index, e)}
                        className="bg-white border border-darkerCustomColor text-sm rounded-lg block w-full p-2.5 placeholder-gray-500 dark:bg-white dark:placeholder:text-gray-600 dark:text-black"
                        placeholder={hoveredItems[index]?.price || "R$0,00"}
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
                        autoComplete="off"
                        type="number"
                        name="quantity"
                        min={0}
                        id={`quantity-${index}`}
                        value={item.quantity.replace(/[^0-9]/g, "")}
                        onChange={(e) => handleChangeItem(index, e)}
                        className="bg-white border border-darkerCustomColor text-sm rounded-lg block w-full p-2.5 placeholder-gray-500 dark:bg-white dark:placeholder:text-gray-600 dark:text-black"
                        placeholder={hoveredItems[index]?.quantity || "0"}
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`weight-${index}`}
                        className="block mb-2 text-sm font-medium"
                      >
                        Peso (em gramas)
                      </label>
                      <input
                        autoComplete="off"
                        type="number"
                        min={0}
                        name="weight"
                        id={`weight-${index}`}
                        value={item.weight || ""}
                        onChange={(e) => handleChangeItem(index, e)}
                        className="bg-white border border-darkerCustomColor text-sm rounded-lg block w-full p-2.5 placeholder-gray-500 dark:bg-white dark:placeholder:text-gray-600 dark:text-black"
                        placeholder={hoveredItems[index]?.weight || "0"}
                        required
                      />
                    </div>

                    {index > 0 && (
                      <div className="flex items-center mt-0 md:mt-6 justify-center md:justify-normal">
                        <button
                          title="Excluir linha"
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex justify-center md:block"
                        >
                          <Image
                            className="hidden md:block dark:hidden"
                            src={"./icons/cancel.svg"}
                            alt="cancel-icon"
                            width={20}
                            height={20}
                          />
                          <Image
                            className="hidden dark:block"
                            src={"./icons/cancel-white.svg"}
                            alt="cancel-icon"
                            width={20}
                            height={20}
                          />
                          <p className="md:hidden text-black font-medium dark:text-white">
                            Excluir este item inteiro
                          </p>
                        </button>
                      </div>
                    )}
                  </div>

                  <hr className="mt-5 mb-3 border-gray-300 dark:border-gray-500" />
                </React.Fragment>
              ))}
            </div>

            <div className="grid justify-center md:flex md:justify-end gap-4 mt-6 grid-columns-3">
              <button
                type="button"
                onClick={handleAddItem}
                className="border border-darkerCustomColor rounded-lg px-4 py-2 bg-white text-gray-700 hover:bg-gray-200 transition duration-200"
              >
                Adicionar mais itens
              </button>
              <button
                type="button"
                onClick={handleModalToggle}
                className="border border-darkerCustomColor rounded-lg px-4 py-2 bg-white text-gray-700 hover:bg-gray-200 transition duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="border border-darkerCustomColor rounded-lg px-4 py-2 bg-white text-gray-700 hover:bg-darkerCustomColor hover:text-white transition duration-200"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>

      <FutureDataSelectionModal
        isOpen={userSelectedFutureDataModalOpen}
        onClose={() => {
          setUserSelectedFutureDataModalOpen(false);
        }}
      />
    </>
  );
}
