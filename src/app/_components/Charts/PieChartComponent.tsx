"use client";

import { PieChart } from "@mui/x-charts";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePurchases } from "@/hooks/usePurchases";
import { Purchase } from "@/hooks/usePurchases";

type UserCredential = {
  userId: string | null;
};

export default function PieChartComponent({ userId }: UserCredential) {
  const { purchases } = usePurchases(userId);
  const [pieChartData, setPieChartData] = useState<
    {
      id: string;
      value: number;
      label: string;
    }[]
  >([]);
  const [hideLegend, setHideLegend] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const totals: { [key: string]: number } = {
      Mercado: 0,
      "Lazer/Entretenimento": 0,
      "Eletrônicos/Tecnologia": 0,
      "Casa/decoração": 0,
      Outros: 0
    };

    purchases.forEach((purchase: Purchase) => {
      const category = purchase.category;

      const totalValue = purchase.items.reduce((sum, item) => {
        return sum + parseFloat(item.price) * parseFloat(item.quantity);
      }, 0);

      if (totals.hasOwnProperty(category)) {
        totals[category] += totalValue;
      } else {
        totals["Outros"] += totalValue;
      }
    });

    const data = Object.entries(totals).map(([key, value]) => ({
      id: key,
      value: value,
      label: key
    }));

    setPieChartData(data);
  }, [userId, purchases, setPieChartData]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width > 1545) {
        setHideLegend(false);
      } else if (width <= 1545 && width > 1280) {
        setHideLegend(true);
      } else if (width <= 1280 && width > 945) {
        setHideLegend(false);
      } else if (width <= 945 && width > 765) {
        setHideLegend(true);
      } else if (width <= 765 && width > 705) {
        setHideLegend(false);
      } else {
        setHideLegend(true); // 705px para baixo some definitivamente
      }
    };

    handleResize(); // Define o estado inicial baseado no tamanho atual da tela
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className="flex flex-row items-center justify-between mt-[-10px]">
        <div className="flex items-center space-x-2">
          <span className="dark:text-black">Gastos por categoria</span>
        </div>
        <div className="z-20">
          <Link href={"/minhas-compras"}>
            <button className="text-white p-2 rounded-lg font-hostGrotesk border-black bg-darkerCustomColor dark:bg-darkerCustomColor dark:text-white hover:bg-gray-800 dark:hover:bg-gray-800 ">
              Ver detalhes
            </button>
          </Link>
        </div>
      </div>

      <div className="font-raleway w-full h-80 flex items-center justify-center">
        <div className="dark:text-white z-10 h-[380px] w-[600px]">
          <PieChart
            colors={["#0081cf", "#00c9a7", "#e09f1f", "#98e288", "#f9f871"]}
            series={[
              {
                data: pieChartData,
                arcLabel: (item) =>
                  `${
                    item.value !== 0
                      ? `${new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL"
                        }).format(item.value)}`
                      : ""
                  } `,
                valueFormatter: (item) =>
                  `${new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                  }).format(item.value)}`,
                outerRadius: 115
              }
            ]}
            margin={{ top: 50, bottom: 110, left: 50, right: 50 }}
            slotProps={{
              legend: {
                hidden: hideLegend,
                direction: "row",
                position: { vertical: "bottom", horizontal: "middle" },
                padding: 15,
                labelStyle: {
                  padding: 10,
                  fontFamily: "inherit"
                }
              }
            }}
            height={380}
            width={600}
          />
        </div>
      </div>
    </>
  );
}
