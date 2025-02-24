"use client";

import { useEffect, useState } from "react";
import { usePurchases } from "@/hooks/usePurchases";
import Image from "next/image";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../../firebase/firebase";
import { LineChart } from "@mui/x-charts";

export function LineChartComponent() {
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedPeriodLineChart, setSelectedPeriodLineChart] = useState(365);
  const [userHasPurchasesInPeriod, setUserHasPurchasesInPeriod] = useState<
    Record<number, boolean>
  >({ 7: true, 30: true, 90: true, 365: true });
  const [lineChartData, setLineChartData] = useState<number[]>([]);
  const [lineChartDates, setLineChartDates] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return () => unsubscribe();
  }, []);

  const { purchases } = usePurchases(userId);

  useEffect(() => {
    if (!userId) return;
    if (!purchases || purchases.length === 0) return;

    const endDate = new Date();
    const startDate = new Date();

    startDate.setDate(endDate.getDate() - selectedPeriodLineChart);

    const filteredPurchases = purchases.filter((purchase) => {
      const dateParts = purchase.purchaseDate.split("-");
      const purchaseDateObj = new Date(
        parseInt(dateParts[0]),
        parseInt(dateParts[1]) - 1,
        parseInt(dateParts[2])
      );

      return purchaseDateObj >= startDate && purchaseDateObj <= endDate;
    });

    const totals: { [date: string]: number } = {};
    filteredPurchases.forEach((purchase) => {
      const dateParts = purchase.purchaseDate.split("-");
      const dateObj = new Date(
        parseInt(dateParts[0]),
        parseInt(dateParts[1]) - 1,
        parseInt(dateParts[2])
      );

      const formattedDate = Intl.DateTimeFormat("pt-BR").format(dateObj);

      const totalSpent = purchase.items.reduce<number>(
        (sum, item) => sum + parseFloat(item.price) * parseFloat(item.quantity),
        0
      );
      totals[formattedDate] = (totals[formattedDate] || 0) + totalSpent;
    });

    const sortedDates = Object.keys(totals).sort((a, b) => {
      const [dayA, monthA, yearA] = a.split("/").map(Number);
      const [dayB, monthB, yearB] = b.split("/").map(Number);
      return (
        new Date(yearA, monthA - 1, dayA).getTime() -
        new Date(yearB, monthB - 1, dayB).getTime()
      );
    });

    setLineChartDates(sortedDates);
    setLineChartData(
      sortedDates.map((date) => parseFloat(totals[date].toFixed(2)))
    );
  }, [
    selectedPeriodLineChart,
    userId,
    purchases,
    setLineChartDates,
    setLineChartData
  ]);

  useEffect(() => {
    if (!userId) return;

    const periods = [7, 30, 90, 365];
    const endDate = new Date();
    const purchasesInPeriod: Record<number, boolean> = {};

    periods.forEach((days) => {
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      // Verificar se tem compra dentro do intervalo
      const exists = purchases.some((purchase) => {
        // Converte a string da data (ex: "2023-08-23") para date
        const dateParts = purchase.purchaseDate.split("-");
        const purchaseDateObj = new Date(
          parseInt(dateParts[0], 10),
          parseInt(dateParts[1], 10) - 1,
          parseInt(dateParts[2], 10)
        );
        return purchaseDateObj >= startDate && purchaseDateObj <= endDate;
      });
      purchasesInPeriod[days] = exists;
    });

    setUserHasPurchasesInPeriod(purchasesInPeriod);
  }, [userId, purchases, setUserHasPurchasesInPeriod]);

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="dark:text-black text-center md:text-start">
            Gastos nos últimos
          </span>
          <select
            className="text-white p-2 rounded-lg font-hostGrotesk border-black bg-darkerCustomColor dark:bg-darkerCustomColor dark:text-white hover:bg-gray-800 dark:hover:hover:bg-gray-800 cursor-pointer"
            value={selectedPeriodLineChart}
            onChange={(e) => setSelectedPeriodLineChart(Number(e.target.value))}
          >
            <option value={365} disabled={!userHasPurchasesInPeriod[365]}>
              1 ano
            </option>
            <option value={90} disabled={!userHasPurchasesInPeriod[90]}>
              90 dias
            </option>
            <option value={30} disabled={!userHasPurchasesInPeriod[30]}>
              30 dias
            </option>
            <option value={7} disabled={!userHasPurchasesInPeriod[7]}>
              7 dias
            </option>
          </select>
        </div>

        <span className="flex items-center font-medium dark:text-black pt-3 md:pt-0">
          <Image
            className="mr-1"
            src={"./icons/info-black.svg"}
            alt="info-icon"
            width={20}
            height={20}
          />
          Inclui o dia atual
        </span>
      </div>
      <div className="w-full h-80 dark:text-white">
        <LineChart
          xAxis={[
            {
              data: lineChartDates,
              scaleType: "band"
            }
          ]}
          yAxis={[
            {
              valueFormatter: (value: number): string =>
                `R$${value.toFixed(2).replace(".", ",")}`
            }
          ]}
          series={[
            {
              valueFormatter: (value: number | null): string =>
                value === null
                  ? "R$0,00"
                  : `R$${value.toFixed(2).replace(".", ",")}`,
              data: lineChartData,
              area: true,
              color: "#1d1e22"
            }
          ]}
          margin={{ left: 100 }}
        />
      </div>
    </>
  );
}
