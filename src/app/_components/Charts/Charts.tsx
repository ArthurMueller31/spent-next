"use client";
import { LineChart } from "@mui/x-charts";
import { useState, useEffect } from "react";
import { firestore } from "../../../../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PurchaseItem {
  name: string;
  price: string;
  quantity: string;
  weight?: string;
}

interface Purchase {
  purchaseDate: string;
  items: PurchaseItem[];
}

export default function Charts() {
  const [selectedPeriod, setSelectedPeriod] = useState(7);
  const [chartData, setChartData] = useState<number[]>([]);
  const [dates, setDates] = useState<string[]>([]);

  useEffect(() => {
    async function fetchPurchases() {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - selectedPeriod);

      const purchasesRef = collection(
        firestore,
        `/users/Xyr05d43WFgGz7fglJcruM7xkXs2/purchases`
      );
      const q = query(
        purchasesRef,
        where("purchaseDate", ">=", startDate.toISOString()),
        where("purchaseDate", "<=", endDate.toISOString())
      );

      const querySnapshot = await getDocs(q);
      const data: number[] = [];
      const labels: string[] = [];

      querySnapshot.forEach((doc) => {
        const purchase = doc.data() as Purchase;
        const date = new Date(purchase.purchaseDate);

        const formattedDate = format(date, "dd/MM/yy", { locale: ptBR });

        labels.push(formattedDate);

        const totalSpent = purchase.items.reduce<number>(
          (sum, item) => sum + parseFloat(item.price),
          0
        );

        data.push(parseFloat(totalSpent.toFixed(2)));
      });

      setChartData(data);
      setDates(labels);
    }

    fetchPurchases();
  }, [selectedPeriod]);

  return (
    <div className="flex h-screen font-raleway tracking-wide">
      <main className="flex-1 ml-64 md:ml-0 flex items-center justify-center bg-gray-50 p-4">
        <div className="w-fit max-w-7xl bg-white rounded-lg shadow-lg p-6 overflow-auto">
          <div>
            <span>Gastos nos últimos</span>
            <select
              className="m-2 p-2 rounded-lg font-hostGrotesk"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(Number(e.target.value))}
            >
              <option value="7">7 dias</option>
              <option value="30">30 dias</option>
              <option value="90">90 dias</option>
            </select>
          </div>
          <LineChart
            xAxis={[{ data: dates, scaleType: "band" }]}
            yAxis={[
              {
                valueFormatter: (value: number): string => {
                  return `R$${value.toFixed(2).replace(".", ",")}`;
                }
              }
            ]}
            series={[
              {
                valueFormatter: (value: number | null): string => {
                  if (value === null) return "R$0,00";
                  return `R$${value.toFixed(2).replace(".", ",")}`;
                },

                data: chartData,
                area: true,
                color: "#1d1e22"
              }
            ]}
            width={800}
            height={300}
            margin={{ left: 100 }}
          />
        </div>

        {/* 
        <div className="w-fit max-w-7xl bg-white rounded-lg shadow-lg p-6 overflow-auto">
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: 10, label: `${varA}` },
                  { id: 1, value: 15, label: "series B" },
                  { id: 2, value: 20, label: "series C" }
                ]
              }
            ]}
            width={400}
            height={200}
          />
        </div>
        <div className="w-fit max-w-7xl bg-white rounded-lg shadow-lg p-6 overflow-auto">
          <BarChart
            series={[
              { data: [35, 44, 24, 34] },
              { data: [51, 6, 49, 30] },
              { data: [15, 25, 30, 50] },
              { data: [60, 50, 15, 25] }
            ]}
            height={290}
            width={400}
            xAxis={[{ data: ["Q1", "Q2", "Q3", "Q4"], scaleType: "band" }]}
            margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
          />
        </div>

        */}
      </main>
    </div>
  );
}
