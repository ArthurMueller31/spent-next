"use client";

import { usePurchases } from "@/hooks/usePurchases";
import { BarChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { Purchase } from "@/hooks/usePurchases";

interface UserCredential {
  userId: string | null;
}

export default function BarChartComponent({ userId }: UserCredential) {
  const { purchases } = usePurchases(userId);
  const [selectedMostSpentDays, setSelectedMostSpentDays] = useState(3);
  const [mostSpentDaysChartData, setMostSpentDaysChartData] = useState<
    number[]
  >([]);
  const [mostSpentDaysChartDates, setMostSpentDaysChartDates] = useState<
    string[]
  >([]);

  const [barTotalsByDate, setBarTotalsByDate] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    if (!userId) return;
    if (!purchases || purchases.length === 0) return;

    const totals: Record<string, number> = {};

    purchases.forEach((purchase: Purchase) => {
      const dateParts = purchase.purchaseDate.split("-");
      const dateObj = new Date(
        parseInt(dateParts[0], 10),
        parseInt(dateParts[1], 10) - 1,
        parseInt(dateParts[2], 10)
      );
      const formattedDate = Intl.DateTimeFormat("pt-BR").format(dateObj);

      const totalSpent = purchase.items.reduce<number>(
        (sum, item) => sum + parseFloat(item.price) * parseFloat(item.quantity),
        0
      );

      totals[formattedDate] = (totals[formattedDate] || 0) + totalSpent;
    });

    setBarTotalsByDate(totals);
  }, [userId, purchases]);

  useEffect(() => {
    const entries = Object.entries(barTotalsByDate);

    entries.sort((a, b) => b[1] - a[1]);
    // ordem crescente
    const topEntries = entries
      .slice(0, selectedMostSpentDays)
      .sort((a, b) => a[1] - b[1]);

    setMostSpentDaysChartDates(topEntries.map(([date]) => date));
    setMostSpentDaysChartData(
      topEntries.map(([, value]) => parseFloat(value.toFixed(2)))
    );
  }, [
    barTotalsByDate,
    selectedMostSpentDays,
    setMostSpentDaysChartDates,
    setMostSpentDaysChartData
  ]);

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="dark:text-black pb-3 md:p-0">
            Dias com mais gastos
          </span>
        </div>
        <div>
          <span className="font-medium dark:text-black mr-2">Exibindo</span>
          <select
            className="text-white p-2 rounded-lg font-hostGrotesk border-black bg-darkerCustomColor dark:bg-darkerCustomColor dark:text-white hover:bg-gray-800 dark:hover:hover:bg-gray-800 cursor-pointer"
            value={selectedMostSpentDays}
            onChange={(e) => setSelectedMostSpentDays(Number(e.target.value))}
          >
            <option value={3}>3 dias</option>
            <option value={5}>5 dias</option>
            <option value={7}>7 dias</option>
          </select>
        </div>
      </div>
      <div className="w-full h-80">
        <BarChart
          xAxis={[{ data: mostSpentDaysChartDates, scaleType: "band" }]}
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
              data: mostSpentDaysChartData,
              color: "#1d1e22"
            }
          ]}
          margin={{ left: 100 }}
        />
      </div>
    </>
  );
}
