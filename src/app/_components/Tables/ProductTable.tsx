"use client";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc
} from "firebase/firestore";
import { firestore, auth } from "../../../../firebase/firebase";
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import useSidebarStore from "../Navigation/Sidebar/sidebarStore";
import Image from "next/image";

type Purchase = {
  id?: string;
  establishment: string;
  purchaseDate: string;
  createdAt: string;
  items: Item[];
};

type Item = {
  name: string;
  price: string;
  quantity: string;
  weight: string;
};

async function fetchPurchases(userId: string): Promise<Purchase[]> {
  const purchasesRef = collection(firestore, `users/${userId}/purchases`);
  const querySnapshot = await getDocs(purchasesRef);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  })) as Purchase[];
}

function formatDate(dateString: string): string {
  const dateParts = dateString.split("-"); // "2025-01-30" -> ["2025", "01", "30"]
  const date = new Date(
    parseInt(dateParts[0]),
    parseInt(dateParts[1]) - 1,
    parseInt(dateParts[2])
  );
  return Intl.DateTimeFormat("pt-BR").format(date);
}

function calculateTotalItems(items: Item[]): number {
  return items.reduce((total, item) => total + Number(item.quantity || 0), 0);
}

function standardPriceFormat(price: string): number {
  const standard = price.replace(/[^0-9,.-]/g, "").replace(",", ".");
  const parsed = parseFloat(standard);
  return isNaN(parsed) ? 0 : parsed;
}

function calculateTotalPrice(items: Item[]): number {
  return items.reduce((total, item) => {
    const price = standardPriceFormat(item.price);
    const quantity = parseFloat(item.quantity) || 1;
    return total + price * quantity;
  }, 0);
}

function formatCurrencyToBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

export default function TempProductTable() {
  const [userId, setUserId] = useState<string | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [expandedPurchase, setExpandedPurchase] = useState<string | null>(null);
  const [editedItem, setEditedItem] = useState<Item | null>(null);
  const setTotalSpent = useSidebarStore((state) => state.setTotalSpent); // acessar zustand
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [addingItem, setAddingItem] = useState(false);
  const [newItem, setNewItem] = useState<Item | null>(null);

  useEffect(() => {
    const setUidFromLoggedUser = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => setUidFromLoggedUser();
  }, []);

  useEffect(() => {
    // Busca as compras somente se o usuário estiver autenticado
    const fetchData = async () => {
      if (userId) {
        const data = await fetchPurchases(userId);

        // ordenar compras de mais recente para mais antiga
        // mais de uma compra no mesmo dia = ordenar por preço
        const sortedData = data.sort((a, b) => {
          const dateA = new Date(a.purchaseDate).getTime();
          const dateB = new Date(b.purchaseDate).getTime();

          if (dateB !== dateA) {
            return dateB - dateA;
          }

          const totalPriceA = calculateTotalPrice(a.items);
          const totalPriceB = calculateTotalPrice(b.items);
          return totalPriceB - totalPriceA;
        });

        const total = sortedData.reduce((sum, purchase) => {
          return sum + calculateTotalPrice(purchase.items);
        }, 0);

        setPurchases(sortedData);
        setTotalSpent(formatCurrencyToBRL(total));
      }
    };

    fetchData();
  }, [userId, setTotalSpent]);

  const handlePurchaseDelete = async (purchaseId: string) => {
    if (!userId) return;

    const confirmDelete = window.confirm(
      "Tem certeza de que deseja excluir esta compra?"
    );
    if (!confirmDelete) return;

    try {
      const purchaseRef = doc(
        firestore,
        `users/${userId}/purchases/${purchaseId}`
      );

      await deleteDoc(purchaseRef);

      setPurchases((prevPurchases) =>
        prevPurchases.filter((p) => p.id !== purchaseId)
      );

      alert("Compra excluída com sucesso.");
    } catch (error) {
      console.log("erro ao excluir", error);
      alert("Erro ao excluir a compra, tente novamente.");
    } finally {
      setPurchases((prevPurchases) =>
        prevPurchases.filter((p) => p.id !== purchaseId)
      );
    }
  };

  const handleEditItem = (item: Item, purchaseId: string, index: number) => {
    if (addingItem) {
      handleCancelAddItem();
    }
    setEditedItem({ ...item });
    setEditingItem(`${purchaseId}-${index}`); // id para edição
  };

  const handleSaveEdit = async (purchaseId: string) => {
    if (!editedItem || !userId || !editingItem) return;

    if (
      !editedItem.name.trim() ||
      !editedItem.quantity.trim() ||
      !editedItem.price.trim() ||
      !editedItem.weight.trim()
    ) {
      alert("Não é possível adicionar itens vazios!");
      return;
    }

    try {
      const [purchaseIdRef, itemIndexStr] = editingItem.split("-");
      const itemIndex = parseInt(itemIndexStr);

      const purchaseIndex = purchases.findIndex((p) => p.id === purchaseIdRef);
      if (purchaseIndex === -1) return;

      const updatedItems = [...purchases[purchaseIndex].items];
      updatedItems[itemIndex] = editedItem;

      const purchaseRef = doc(
        firestore,
        `users/${userId}/purchases/${purchaseId}`
      );

      await updateDoc(purchaseRef, { items: updatedItems });

      setPurchases((prev) =>
        prev.map((p) =>
          p.id === purchaseId ? { ...p, items: updatedItems } : p
        )
      );
    } catch (error) {
      console.error("Erro ao salvar edição:", error);
    } finally {
      setEditingItem(null);
      setEditedItem(null);
    }
  };

  const handleCancelEdit = () => {
    setEditedItem(null); // Cancela a edição
    setEditingItem(null); // Limpa o estado de edição
  };

  const handleItemDelete = async (purchaseId: string, itemIndex: number) => {
    if (!userId) return;

    try {
      const purchaseIndex = purchases.findIndex((p) => p.id === purchaseId);
      if (purchaseIndex === -1) return;

      const updatedItems = [...purchases[purchaseIndex].items];
      updatedItems.splice(itemIndex, 1);

      const purchaseRef = doc(
        firestore,
        `users/${userId}/purchases/${purchaseId}`
      );

      await updateDoc(purchaseRef, { items: updatedItems });

      setPurchases((prevPurchases) =>
        prevPurchases.map((p) =>
          p.id === purchaseId ? { ...p, items: updatedItems } : p
        )
      );
    } catch (error) {
      console.log("Erro:", error);
    }
  };

  const handleOpenAddItem = (purchaseId: string) => {
    setAddingItem(true);
    setNewItem({
      name: "",
      quantity: "",
      price: "",
      weight: ""
    });

    setEditingItem(`add-${purchaseId}`);
  };

  const handleCancelAddItem = () => {
    setAddingItem(false);
    setNewItem(null);
    setEditedItem(null);
  };

  const handleSaveNewItem = async (purchaseId: string) => {
    if (!newItem) return;

    if (
      !newItem.name.trim() ||
      !newItem.quantity.trim() ||
      !newItem.price.trim() ||
      !newItem.weight.trim()
    ) {
      alert("Não é possível adicionar itens vazios!");
      return;
    }

    try {
      const purchaseIndex = purchases.findIndex((p) => p.id === purchaseId);

      if (purchaseIndex === -1) return;

      const updatedItems = [...purchases[purchaseIndex].items, newItem];

      const purchaseRef = doc(
        firestore,
        `users/${userId}/purchases/${purchaseId}`
      );

      await updateDoc(purchaseRef, { items: updatedItems });
      setPurchases((prevPurchases) =>
        prevPurchases.map((p) =>
          p.id === purchaseId ? { ...p, items: updatedItems } : p
        )
      );
    } catch (error) {
      console.log("Erro ao add", error);
    } finally {
      setAddingItem(false);
      setNewItem(null);
      setEditingItem(null);
    }
  };

  return (
    <>
      <div className="flex h-screen font-raleway tracking-wide">
        <main className="flex-1 ml-64 md:ml-0 flex items-center justify-center bg-gray-50 p-4">
          <div className="w-full max-w-7xl bg-white rounded-lg shadow-lg p-6 overflow-auto">
            {userId && (
              <table className="w-full border border-gray-300 text-sm text-left rounded-lg">
                <thead className="bg-darkerCustomColor">
                  <tr className="flex justify-around text-white text-base">
                    <th className="flex-1 p-3 border-b text-center">
                      Local da Compra
                    </th>
                    <th className="flex-1 p-3 border-b text-center">
                      Quantidade Total de Itens
                    </th>
                    <th className="flex-1 p-3 border-b text-center ">
                      Preço Total
                    </th>
                    <th className="flex-1 p-3 border-b text-center">
                      Dia da Compra
                    </th>
                    <th className="flex-1 p-3 border-b text-center">
                      Expandir/Excluir compra
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((purchase) => (
                    <React.Fragment key={purchase.id}>
                      <tr className="flex justify-around hover:bg-gray-50 cursor-pointer">
                        <td className="flex-1 p-3 border-b text-center font-hostGrotesk font-bold flex items-center justify-center text-lg">
                          {purchase.establishment}
                        </td>
                        <td className="flex-1 p-3 border-b text-center font-hostGrotesk font-bold flex items-center justify-center text-lg">
                          {calculateTotalItems(purchase.items)}
                        </td>
                        <td className="flex-1 p-3 border-b text-center font-hostGrotesk font-bold flex items-center justify-center text-lg">
                          {formatCurrencyToBRL(
                            calculateTotalPrice(purchase.items)
                          )}
                        </td>
                        <td className="flex-1 p-3 border-b text-center font-hostGrotesk font-bold flex items-center justify-center text-lg">
                          {formatDate(purchase.purchaseDate)}
                        </td>
                        <td className="flex-1 p-3 border-b text-center font-hostGrotesk font-bold flex items-center justify-center text-lg">
                          <button
                            className="mx-1 px-2 hover:bg-gray-300 transition duration-200 rounded-xl"
                            title="Expandir"
                            onClick={() => {
                              if (expandedPurchase === purchase.id) {
                                handleCancelAddItem();
                                handleCancelEdit();
                                setExpandedPurchase(null);
                              } else {
                                handleCancelAddItem();
                                handleCancelEdit();
                                setExpandedPurchase(purchase.id!);
                              }
                            }}
                          >
                            <Image
                              className="m-1"
                              src={"./icons/expand.svg"}
                              alt="expand-invoice-icon"
                              width={30}
                              height={30}
                            />
                          </button>

                          <button
                            className="mx-1 px-2 hover:bg-red-600 transition duration-200 rounded-xl"
                            title="Excluir"
                            onClick={() => handlePurchaseDelete(purchase.id!)}
                          >
                            <Image
                              className="m-1"
                              src={"./icons/delete.svg"}
                              alt="delete-bin-icon"
                              width={30}
                              height={30}
                            />
                          </button>
                        </td>
                      </tr>

                      {/* Tabela expandida da compra */}
                      {expandedPurchase === purchase.id && (
                        <tr className="w-full">
                          <td colSpan={4} className="p-3 bg-gray-50 border-b">
                            <table className="w-full text-sm border border-gray-300 mt-2 rounded-lg">
                              <thead className="bg-darkerCustomColor text-white">
                                <tr className="text-base">
                                  <th className="p-2 border-b text-center">
                                    Nome do Item
                                  </th>
                                  <th className="p-2 border-b text-center">
                                    Quantidade
                                  </th>
                                  <th className="p-2 border-b text-center">
                                    Preço Unitário
                                  </th>
                                  <th className="p-2 border-b text-center">
                                    Peso (gramas)
                                  </th>
                                  <th className="p-2 border-b text-center">
                                    Editar/Excluir
                                  </th>
                                </tr>
                              </thead>

                              <tbody>
                                {/* Ordena itens em ordem alfabética */}
                                {purchase.items
                                  .map((item, originalIndex) => ({
                                    item,
                                    originalIndex
                                  }))
                                  .sort((a, b) =>
                                    a.item.name.localeCompare(b.item.name)
                                  )
                                  .map(({ item, originalIndex }) => (
                                    <tr
                                      key={`${purchase.id}-${originalIndex}`}
                                      className="text-center text-base font-medium font-hostGrotesk"
                                    >
                                      <td className="p-2 border-b">
                                        {editingItem ===
                                        `${purchase.id}-${originalIndex}` ? (
                                          <input
                                            type="text"
                                            value={editedItem?.name || ""}
                                            onChange={(e) =>
                                              setEditedItem({
                                                ...editedItem!,
                                                name: e.target.value
                                              })
                                            }
                                            className="text-center p-2 rounded-lg border border-darkerCustomColor"
                                          />
                                        ) : (
                                          item.name
                                        )}
                                      </td>

                                      <td className="p-2 border-b ">
                                        {editingItem ===
                                        `${purchase.id}-${originalIndex}` ? (
                                          <input
                                            type="text"
                                            value={editedItem?.quantity || ""} // aqui só exibe nome
                                            onChange={(e) =>
                                              setEditedItem({
                                                ...editedItem!,
                                                quantity: e.target.value
                                              })
                                            }
                                            className="text-center p-2 rounded-lg border border-darkerCustomColor"
                                          />
                                        ) : (
                                          item.quantity
                                        )}
                                      </td>

                                      <td className="p-2 border-b">
                                        {editingItem ===
                                        `${purchase.id}-${originalIndex}` ? (
                                          <input
                                            type="text"
                                            value={editedItem?.price || ""} // aqui só exibe nome
                                            onChange={(e) =>
                                              setEditedItem({
                                                ...editedItem!,
                                                price: e.target.value
                                              })
                                            }
                                            className="text-center p-2 rounded-lg border border-darkerCustomColor"
                                          />
                                        ) : (
                                          formatCurrencyToBRL(
                                            Number(item.price)
                                          )
                                        )}
                                      </td>

                                      <td className="p-2 border-b">
                                        {editingItem ===
                                        `${purchase.id}-${originalIndex}` ? (
                                          <input
                                            type="text"
                                            value={editedItem?.weight || ""} // aqui só exibe nome
                                            onChange={(e) =>
                                              setEditedItem({
                                                ...editedItem!,
                                                weight: e.target.value
                                              })
                                            }
                                            className="text-center p-2 rounded-lg border border-darkerCustomColor"
                                          />
                                        ) : (
                                          item.weight
                                        )}
                                      </td>
                                      <td className="p-2 border-b self-center">
                                        {editingItem ===
                                        `${purchase.id}-${originalIndex}` ? (
                                          <>
                                            <button
                                              className="m-1 px-3 py-1 hover:bg-green-600 transition duration-200 rounded"
                                              onClick={() =>
                                                handleSaveEdit(purchase.id!)
                                              }
                                            >
                                              <Image
                                                src={"./icons/check.svg"}
                                                alt="save-icon"
                                                width={25}
                                                height={25}
                                                title="Salvar"
                                              />
                                            </button>
                                            <button
                                              className="m-1 px-3 py-1 hover:bg-red-600 transition duration-200 rounded"
                                              onClick={handleCancelEdit}
                                              title="Cancelar"
                                            >
                                              <Image
                                                src={"./icons/cancel.svg"}
                                                alt="cancel-icon"
                                                width={25}
                                                height={25}
                                              />
                                            </button>
                                          </>
                                        ) : (
                                          <>
                                            <button
                                              className="mx-1 px-2 hover:bg-gray-300 transition duration-200 rounded-lg"
                                              onClick={() =>
                                                handleEditItem(
                                                  item,
                                                  purchase.id!,
                                                  originalIndex
                                                )
                                              }
                                              title="Editar"
                                            >
                                              <Image
                                                className="m-1"
                                                src={"./icons/edit.svg"}
                                                alt="edit-icon"
                                                width={25}
                                                height={25}
                                              />
                                            </button>
                                            <button
                                              className="mx-1 px-2 hover:bg-red-600 transition duration-200 rounded-lg"
                                              onClick={() =>
                                                handleItemDelete(
                                                  purchase.id!,
                                                  originalIndex
                                                )
                                              }
                                            >
                                              <Image
                                                className="m-1"
                                                src={"./icons/delete.svg"}
                                                alt="delete-bin-icon"
                                                width={25}
                                                height={25}
                                              />
                                            </button>
                                          </>
                                        )}
                                      </td>
                                    </tr>
                                  ))}

                                {addingItem &&
                                  editingItem === `add-${purchase.id}` && (
                                    <tr className="text-center text-base font-medium">
                                      <td className="p-2 border-b">
                                        <input
                                          type="text"
                                          placeholder="Nome do item"
                                          value={newItem?.name || ""}
                                          onChange={(e) =>
                                            setNewItem({
                                              ...newItem!,
                                              name: e.target.value
                                            })
                                          }
                                          className="text-center p-2 rounded-lg border border-darkerCustomColor"
                                        />
                                      </td>
                                      <td className="p-2 border-b">
                                        <input
                                          type="text"
                                          placeholder="Quantidade"
                                          value={newItem?.quantity || ""}
                                          onChange={(e) =>
                                            setNewItem({
                                              ...newItem!,
                                              quantity: e.target.value
                                            })
                                          }
                                          className="text-center p-2 rounded-lg border border-darkerCustomColor"
                                        />
                                      </td>
                                      <td className="p-2 border-b">
                                        <input
                                          type="text"
                                          placeholder="Preço Unitário"
                                          value={newItem?.price || ""}
                                          onChange={(e) =>
                                            setNewItem({
                                              ...newItem!,
                                              price: e.target.value
                                            })
                                          }
                                          className="text-center p-2 rounded-lg border border-darkerCustomColor"
                                        />
                                      </td>
                                      <td className="p-2 border-b">
                                        <input
                                          type="text"
                                          placeholder="Peso (gramas)"
                                          value={newItem?.weight || ""}
                                          onChange={(e) =>
                                            setNewItem({
                                              ...newItem!,
                                              weight: e.target.value
                                            })
                                          }
                                          className="text-center p-2 rounded-lg border border-darkerCustomColor"
                                        />
                                      </td>
                                      <td className="p-2 border-b self-center">
                                        <button
                                          className="m-1 px-3 py-1 hover:bg-green-600 transition duration-200 rounded"
                                          onClick={() =>
                                            handleSaveNewItem(purchase.id!)
                                          }
                                        >
                                          <Image
                                            src={"./icons/check.svg"}
                                            alt="Salvar"
                                            width={25}
                                            height={25}
                                            title="Salvar"
                                          />
                                        </button>
                                        <button
                                          className="m-1 px-3 py-1 hover:bg-red-600 transition duration-200 rounded"
                                          onClick={handleCancelAddItem}
                                          title="Cancelar"
                                        >
                                          <Image
                                            src={"./icons/cancel.svg"}
                                            alt="Cancelar"
                                            width={25}
                                            height={25}
                                          />
                                        </button>
                                      </td>
                                    </tr>
                                  )}
                              </tbody>
                              {!addingItem && (
                                <tfoot>
                                  <tr>
                                    <td className="p-2 flex justify-center">
                                      <button
                                        className="bg-white border border-black rounded p-1.5 flex flex-row justify-center items-center font-medium hover:bg-gray-200 transtition duration-200"
                                        onClick={() =>
                                          handleOpenAddItem(purchase.id!)
                                        }
                                      >
                                        <Image
                                          src={"./icons/add.svg"}
                                          alt="add-icon"
                                          width={25}
                                          height={25}
                                          className="mr-1"
                                        />
                                        Adicionar item
                                      </button>
                                    </td>
                                  </tr>
                                </tfoot>
                              )}
                            </table>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
