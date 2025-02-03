"use client";
import { LineChart } from "@mui/x-charts";
import { useState, useEffect } from "react";
import { auth, firestore } from "../../../../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

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
    async function fetchPurchases() {
      if (!userId) return;

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - selectedPeriod);

      const purchasesRef = collection(firestore, `/users/${userId}/purchases`);
      const q = query(
        purchasesRef,
        where("purchaseDate", ">=", startDate.toISOString()),
        where("purchaseDate", "<=", endDate.toISOString())
      );

      const querySnapshot = await getDocs(q);

      // Agrupar compras por data
      const totalsByDate: { [date: string]: number } = {};

      querySnapshot.forEach((doc) => {
        const purchase = doc.data() as Purchase;
        const dateParts = purchase.purchaseDate.split("-");
        const date = new Date(
          parseInt(dateParts[0]),
          parseInt(dateParts[1]) - 1,
          parseInt(dateParts[2])
        );
        const formattedDate = Intl.DateTimeFormat("pt-BR").format(date);

        // Calculando o total gasto na compra
        const totalSpent = purchase.items.reduce<number>(
          (sum, item) =>
            sum + parseFloat(item.price) * parseFloat(item.quantity),
          0
        );

        // Agrupar as compras pelo mesmo dia
        if (totalsByDate[formattedDate]) {
          totalsByDate[formattedDate] += totalSpent;
        } else {
          totalsByDate[formattedDate] = totalSpent;
        }
      });

      // Organizando os dados para o gráfico
      const data: number[] = [];
      const labels: string[] = [];

      Object.keys(totalsByDate).forEach((date) => {
        labels.push(date);
        data.push(parseFloat(totalsByDate[date].toFixed(2)));
      });

      setChartData(data);
      setDates(labels);
    }

    fetchPurchases();
  }, [selectedPeriod, userId]);

  return (
    <div className="flex h-screen font-raleway tracking-wide">
      <main className="flex-1 ml-64 md:ml-0 flex items-center justify-center bg-gray-50 p-4">
        <div className="w-fit max-w-7xl bg-white rounded-lg shadow-lg p-6 overflow-auto">
          <div>
            <span>Gastos nos últimos</span>
            <select
              className="m-2 p-2 rounded-lg font-hostGrotesk border bg-gray-100"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(Number(e.target.value))}
            >
              <option value="7">7 dias</option>
              <option value="30">30 dias</option>
              <option value="90">90 dias</option>
              <option value="365">1 ano</option>
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
      </main>
    </div>
  );
}
{
  /* 
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

        */
}
