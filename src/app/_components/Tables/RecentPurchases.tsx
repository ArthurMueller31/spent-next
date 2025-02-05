"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { firestore, auth } from "../../../../firebase/firebase";

type Purchase = {
  id?: string;
  establishment: string;
  purchaseDate: string;
  items: Item[];
};

type Item = {
  name: string;
  price: string;
  quantity: string;
  weight?: string;
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
  const dateParts = dateString.split("-");
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

export default function RecentPurchasesTable() {
  const [userId, setUserId] = useState<string | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  useEffect(() => {
    // Observa a autenticação do usuário
    const userData = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });
    return () => userData();
  }, []);

  useEffect(() => {
    const loadPurchases = async () => {
      if (userId) {
        const data = await fetchPurchases(userId);
        // Ordena as compras por data decrescente
        const sortedPurchases = data.sort((a, b) => {
          const dateA = new Date(a.purchaseDate).getTime();
          const dateB = new Date(b.purchaseDate).getTime();
          return dateB - dateA;
        });
        // Seleciona somente as 5 primeiras compras
        setPurchases(sortedPurchases.slice(0, 5));
      }
    };
    loadPurchases();
  }, [userId]);

  return (
    <div className="w-full">
      {/*max-w-4xl bg-white rounded-lg shadow-lg p-6 overflow-auto */}
      <div className="flex flex-row items-center justify-between mb-10">
        <div className="flex items-center space-x-2">
          <span>Minhas últimas compras</span>
        </div>
      </div>
      <table className="w-full border border-gray-300 text-md text-left rounded-lg font-hostGrotesk">
        <thead className="bg-darkerCustomColor">
          <tr className="flex justify-around text-white text-base">
            <th className="flex-1 p-3 border-b text-center">Local</th>
            <th className="flex-1 p-3 border-b text-center">Total de Itens</th>
            <th className="flex-1 p-3 border-b text-center">Preço Total</th>
            <th className="flex-1 p-3 border-b text-center">Data</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((purchase) => (
            <tr
              key={purchase.id}
              className="flex justify-around hover:bg-gray-50 cursor-pointer"
            >
              <td className="flex-1 p-3 border-b text-center font-bold">
                {purchase.establishment}
              </td>
              <td className="flex-1 p-3 border-b text-center font-bold">
                {calculateTotalItems(purchase.items)}
              </td>
              <td className="flex-1 p-3 border-b text-center font-bold">
                {formatCurrencyToBRL(calculateTotalPrice(purchase.items))}
              </td>
              <td className="flex-1 p-3 border-b text-center font-bold">
                {formatDate(purchase.purchaseDate)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
