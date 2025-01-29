"use client";

import { collection, getDocs } from "firebase/firestore";
import { firestore, auth } from "../../../../firebase/firebase";
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import useSidebarStore from "../Navigation/Sidebar/sidebarStore";

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
  const date = new Date(dateString);
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

export default function ProductTable() {
  const [userId, setUserId] = useState<string | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [expandedPurchase, setExpandedPurchase] = useState<string | null>(null);
  const setTotalSpent = useSidebarStore((state) => state.setTotalSpent); // acessar estado

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

  return (
    <>
      <div className="flex h-screen font-raleway tracking-wide">
        <main className="flex-1 ml-64 md:ml-0 flex items-center justify-center bg-gray-50 p-4">
          <div className="w-full max-w-7xl bg-white rounded-lg shadow-lg p-6 overflow-auto">
            {userId && (
              <table className="w-full border border-gray-300 text-sm text-left rounded-lg">
                <thead className="bg-darkerCustomColor">
                  <tr className="flex justify-around text-white">
                    <th className="flex-1 p-3 border-b text-center">
                      Local da Compra
                    </th>
                    <th className="flex-1 p-3 border-b text-center">
                      Quantidade Total de Itens
                    </th>
                    <th className="flex-1 p-3 border-b text-center">
                      Preço Total
                    </th>
                    <th className="flex-1 p-3 border-b text-center">
                      Dia da Compra
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((purchase) => (
                    <React.Fragment key={purchase.id}>
                      {/* Linha clicável da compra */}
                      <tr
                        className="flex justify-around hover:bg-gray-50 cursor-pointer"
                        onClick={() =>
                          setExpandedPurchase(
                            expandedPurchase === purchase.id
                              ? null
                              : purchase.id!
                          )
                        }
                      >
                        <td className="flex-1 p-3 border-b text-center">
                          {purchase.establishment}
                        </td>
                        <td className="flex-1 p-3 border-b text-center font-hostGrotesk font-light">
                          {calculateTotalItems(purchase.items)}
                        </td>
                        <td className="flex-1 p-3 border-b text-center font-hostGrotesk font-light">
                          {formatCurrencyToBRL(
                            calculateTotalPrice(purchase.items)
                          )}
                        </td>
                        <td className="flex-1 p-3 border-b text-center font-hostGrotesk font-light">
                          {formatDate(purchase.purchaseDate)}
                        </td>
                      </tr>

                      {/* Tabela expandida da compra */}
                      {expandedPurchase === purchase.id && (
                        <tr className="w-full">
                          <td colSpan={4} className="p-3 bg-gray-50 border-b">
                            <table className="w-full text-sm border border-gray-300 mt-2 rounded-lg">
                              <thead className="bg-darkerCustomColor text-white">
                                <tr>
                                  <th className="p-2 border-b text-center">
                                    Nome do Item
                                  </th>
                                  <th className="p-2 border-b text-center">
                                    Quantidade
                                  </th>
                                  <th className="p-2 border-b text-center">
                                    Preço Unitário
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {purchase.items.map((item, index) => (
                                  <tr
                                    key={`${purchase.id}-${index}`}
                                    className="text-center"
                                  >
                                    <td className="p-2 border-b">
                                      {item.name}
                                    </td>
                                    <td className="p-2 border-b font-hostGrotesk font-light">
                                      {item.quantity}
                                    </td>
                                    <td className="p-2 border-b font-hostGrotesk font-light">
                                      {formatCurrencyToBRL(
                                        standardPriceFormat(item.price)
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
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
