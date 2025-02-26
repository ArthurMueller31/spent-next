"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePurchases } from "@/hooks/usePurchases";

type UserCredential = {
  userId: string | null;
};

type Item = {
  name: string;
  price: string;
  quantity: string;
  weight?: string;
};

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

export default function RecentPurchasesTable({ userId }: UserCredential) {
  // const [purchases, setPurchases] = useState<Purchase[]>([]);

  const { purchases } = usePurchases(userId);

  const sortedPurchases = [...purchases].sort((a, b) => {
    const dateA = new Date(a.purchaseDate).getTime();
    const dateB = new Date(b.purchaseDate).getTime();
    return dateB - dateA;
  });

  const recentPurchases = sortedPurchases.slice(0, 5);

  return (
    <div className="relative w-full">
      <div className="flex justify-between items-center relative pt-0 xl:pt-10">
        <span className="dark:text-black">
          Minhas últimas compras (até cinco)
        </span>
        <Link href={"/minhas-compras"}>
          <button className="flex items-center text-white p-2 rounded-lg font-hostGrotesk border-black bg-darkerCustomColor dark:bg-darkerCustomColor dark:text-white hover:bg-gray-800 dark:hover:bg-gray-800">
            Ver todas
            <Image
              src={"./icons/arrow-forward.svg"}
              alt="forward-arrow-icon"
              width={15}
              height={15}
              className="ml-2 self-center hidden sm:block"
            />
          </button>
        </Link>
      </div>

      <div className="flex flex-col w-full mt-4 xl:mt-10">
        <div className="w-full min-h-[330px] overflow-x-auto">
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
              {recentPurchases.map((purchase) => (
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
    </div>
  );
}
