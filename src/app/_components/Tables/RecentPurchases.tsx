"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { firestore, auth } from "../../../../firebase/firebase";
import Link from "next/link";
import Image from "next/image";

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
    <>
      <div className="flex flex-row justify-between w-full items-center pb-20 relative">
        <span className="dark:text-black">Minhas últimas compras</span>
        <Link href={"/minhas-compras"}>
          <button className="flex text-white p-2 rounded-lg font-hostGrotesk border-black bg-darkerCustomColor dark:bg-darkerCustomColor dark:text-white hover:bg-gray-800 dark:hover:bg-gray-800">
            Ver todas
            <Image
              src={"./icons/arrow-forward.svg"}
              alt="forward-arrow-icon"
              width={15}
              height={15}
              className="ml-2 self-center"
            />
          </button>
        </Link>
      </div>

      <div className="flex flex-col w-full">
        {/* Área da Tabela */}
        <div className="w-full min-h-[250px] overflow-x-auto">
          <table className="w-full border border-gray-300 text-md text-left rounded-lg font-hostGrotesk">
            <thead className="bg-darkerCustomColor">
              <tr className="flex justify-around text-white text-base">
                <th className="flex-1 p-3 border-b text-center">Local</th>
                <th className="flex-1 p-3 border-b text-center">
                  Total de Itens
                </th>
                <th className="flex-1 p-3 border-b text-center">Preço Total</th>
                <th className="flex-1 p-3 border-b text-center">Data</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase) => (
                <tr
                  key={purchase.id}
                  className="flex justify-around hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-100 dark:text-black"
                >
                  <td className="flex-1 p-3 border-b text-center font-bold w-32">
                    {purchase.establishment}
                  </td>
                  <td className="flex-1 p-3 border-b text-center font-bold w-32">
                    {calculateTotalItems(purchase.items)}
                  </td>
                  <td className="flex-1 p-3 border-b text-center font-bold w-32">
                    {formatCurrencyToBRL(calculateTotalPrice(purchase.items))}
                  </td>
                  <td className="flex-1 p-3 border-b text-center font-bold w-32">
                    {formatDate(purchase.purchaseDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
