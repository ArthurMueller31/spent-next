"use client";

import { collection, getDocs } from "firebase/firestore";
import { firestore, auth } from "../../../../firebase/firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

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

export default function ProductTable() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

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

        setPurchases(sortedData);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div className="flex h-screen font-raleway tracking-wide">
      <main className="flex-1 ml-64 md:ml-0 flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-7xl bg-white rounded-lg shadow-lg p-6 overflow-auto">
          {userId && (
            <table className="w-full border border-gray-300 text-sm text-left rounded-lg">
              <thead className="bg-gray-100">
                <tr className="flex justify-around">
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
              <tbody className="">
                {purchases.map((purchase) => (
                  <tr
                    key={purchase.id}
                    className="flex justify-around hover:bg-gray-50"
                  >
                    <td className="flex-1 p-3 border-b text-center">
                      {purchase.establishment || "Desconhecido"}
                    </td>
                    <td className="flex-1 p-3 border-b text-center font-hostGrotesk">
                      {calculateTotalItems(purchase.items)}
                    </td>
                    <td className="flex-1 p-3 border-b text-center font-hostGrotesk">
                      R${" "}
                      {calculateTotalPrice(purchase.items)
                        .toFixed(2)
                        .replace(".", ",")}
                    </td>
                    <td className="flex-1 p-3 border-b text-center font-hostGrotesk">
                      {purchase.purchaseDate
                        ? formatDate(purchase.purchaseDate)
                        : "Sem Data"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
