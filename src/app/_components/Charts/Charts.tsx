"use client";
import { BarChart, LineChart, PieChart } from "@mui/x-charts";
import { useState, useEffect } from "react";
import { auth, firestore } from "../../../../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "../Navigation/Navbar/Navbar";
import Sidebar from "../Navigation/Sidebar/Sidebar";
import RecentPurchases from "../Tables/RecentPurchases";
import Image from "next/image";
import Link from "next/link";

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
  // Gráfico de linhas (gastos totais)
  const [selectedPeriodLineChart, setSelectedPeriodLineChart] = useState(7);
  const [lineChartData, setLineChartData] = useState<number[]>([]);
  const [lineChartDates, setLineChartDates] = useState<string[]>([]);

  // Gráfico de barras (dias com maiores gastos - all time)
  // Não usamos um estado para o período, pois buscamos todas as compras
  const [selectedMostSpentDays, setSelectedMostSpentDays] = useState(3);
  const [barTotalsByDate, setBarTotalsByDate] = useState<{
    [date: string]: number;
  }>({});
  const [mostSpentDaysChartData, setMostSpentDaysChartData] = useState<
    number[]
  >([]);
  const [mostSpentDaysChartDates, setMostSpentDaysChartDates] = useState<
    string[]
  >([]);
  const [pieChartData, setPieChartData] = useState<
    { id: string; value: number; label: string }[]
  >([]);
  const [hideLegend, setHideLegend] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);

  // Monitorar usuário autenticado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return () => unsubscribe();
  }, []);

  // Query para o gráfico de linhas (gastos totais dos últimos N dias)
  useEffect(() => {
    async function fetchLineChartPurchases() {
      if (!userId) return;

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - selectedPeriodLineChart);

      const purchasesRef = collection(firestore, `/users/${userId}/purchases`);
      const q = query(
        purchasesRef,
        where("purchaseDate", ">=", startDate.toISOString()),
        where("purchaseDate", "<=", endDate.toISOString())
      );

      const querySnapshot = await getDocs(q);
      const totals: { [date: string]: number } = {};

      querySnapshot.forEach((doc) => {
        const purchase = doc.data() as Purchase;
        const dateParts = purchase.purchaseDate.split("-");
        const dateObj = new Date(
          parseInt(dateParts[0]),
          parseInt(dateParts[1]) - 1,
          parseInt(dateParts[2])
        );
        const formattedDate = Intl.DateTimeFormat("pt-BR").format(dateObj);

        const totalSpent = purchase.items.reduce<number>(
          (sum, item) =>
            sum + parseFloat(item.price) * parseFloat(item.quantity),
          0
        );

        totals[formattedDate] = (totals[formattedDate] || 0) + totalSpent;
      });

      // Organizar dados cronologicamente
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
    }
    fetchLineChartPurchases();
  }, [selectedPeriodLineChart, userId]);

  // Query para o gráfico de barras (todas as compras - all time)
  useEffect(() => {
    async function fetchBarChartPurchases() {
      if (!userId) return;

      // Aqui não aplicamos filtro de data, pegamos todas as compras do usuário
      const purchasesRef = collection(firestore, `/users/${userId}/purchases`);
      const q = query(purchasesRef);

      const querySnapshot = await getDocs(q);
      const totals: { [date: string]: number } = {};

      querySnapshot.forEach((doc) => {
        const purchase = doc.data() as Purchase;
        const dateParts = purchase.purchaseDate.split("-");
        const dateObj = new Date(
          parseInt(dateParts[0]),
          parseInt(dateParts[1]) - 1,
          parseInt(dateParts[2])
        );
        const formattedDate = Intl.DateTimeFormat("pt-BR").format(dateObj);

        const totalSpent = purchase.items.reduce<number>(
          (sum, item) =>
            sum + parseFloat(item.price) * parseFloat(item.quantity),
          0
        );

        totals[formattedDate] = (totals[formattedDate] || 0) + totalSpent;
      });

      setBarTotalsByDate(totals);
    }
    fetchBarChartPurchases();
  }, [userId]); // Não depende de período

  // Atualiza o gráfico de barras (top dias) sempre que os dados do bar chart ou o número de dias a mostrar mudarem
  useEffect(() => {
    const entries = Object.entries(barTotalsByDate);
    // Ordena decrescentemente para identificar os dias com maiores gastos
    entries.sort((a, b) => b[1] - a[1]);
    // Seleciona os top dias e, em seguida, ordena em ordem crescente (para exibição)
    const topEntries = entries
      .slice(0, selectedMostSpentDays)
      .sort((a, b) => a[1] - b[1]);
    setMostSpentDaysChartDates(topEntries.map(([date]) => date));
    setMostSpentDaysChartData(
      topEntries.map(([, value]) => parseFloat(value.toFixed(2)))
    );
  }, [barTotalsByDate, selectedMostSpentDays]);

  useEffect(() => {
    async function fetchPieChartData() {
      if (!userId) return;

      const purchasesRef = collection(firestore, `/users/${userId}/purchases`);
      const querySnapshot = await getDocs(purchasesRef);

      const counts: { [key: string]: number } = {
        Mercado: 0,
        "Lazer/Entretenimento": 0,
        "Eletrônicos/Tecnologia": 0,
        "Casa/decoração": 0,
        Outro: 0
      };

      querySnapshot.forEach((doc) => {
        const purchase = doc.data() as { category?: string };
        const category =
          purchase.category && purchase.category.trim() !== ""
            ? purchase.category
            : "Mercado"; // ou "Outro", conforme sua lógica

        if (counts.hasOwnProperty(category)) {
          counts[category] += 1;
        } else {
          counts["Outro"] += 1;
        }
      });

      const data = Object.entries(counts).map(([key, value]) => ({
        id: key,
        value,
        label: key
      }));

      setPieChartData(data);
    }
    fetchPieChartData();
  }, [userId]);

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
    <div className="relative">
      <Sidebar />
      <Navbar />
      <div className="md:pl-64 md:ml-12 px-14 pb-4 pt-20 h-screen overflow-auto font-raleway tracking-wide bg-gray-50 dark:bg-darkerCustomColor overflow-y-auto">
        <div className="grid grid-cols-1 gap-8 h-full xl:grid-cols-2 xl:grid-rows-2">
          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center dark:bg-white ">
            <RecentPurchases />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-center dark:bg-white">
            <div className="flex flex-row items-center justify-between mt-[-10px]">
              <div className="flex items-center space-x-2">
                <span className="dark:text-black">
                  Categorias com mais compras adicionadas
                </span>
              </div>
              <div>
                <Link href={"/minhas-compras"}>
                  <button className="text-white p-2 rounded-lg font-hostGrotesk border-black bg-darkerCustomColor dark:bg-darkerCustomColor dark:text-white hover:bg-gray-800 dark:hover:bg-gray-800">
                    Ver detalhes
                  </button>
                </Link>
              </div>
            </div>

            <div className="font-raleway w-full h-80 flex items-center justify-center">
              <div className="dark:text-white z-10">
                <PieChart
                  series={[
                    {
                      data: pieChartData,
                      arcLabel: (item) =>
                        `${item.value !== 0 ? item.value : ""} `
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
          </div>

          {/* gráfico de linhas, compras nos últimos x dias */}
          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between dark:bg-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="dark:text-black text-center md:text-start">
                  Gastos nos últimos
                </span>
                <select
                  className="text-white p-2 rounded-lg font-hostGrotesk border-black bg-darkerCustomColor dark:bg-darkerCustomColor dark:text-white hover:bg-gray-800 dark:hover:hover:bg-gray-800 cursor-pointer"
                  value={selectedPeriodLineChart}
                  onChange={(e) =>
                    setSelectedPeriodLineChart(Number(e.target.value))
                  }
                >
                  <option value={7}>7 dias</option>
                  <option value={30}>30 dias</option>
                  <option value={90}>90 dias</option>
                  <option value={365}>1 ano</option>
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
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between dark:bg-white h-max">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="dark:text-black pb-3 md:p-0">
                  Dias com mais gastos
                </span>
              </div>
              <div>
                <span className="font-medium dark:text-black mr-2">
                  Exibindo
                </span>
                <select
                  className="text-white p-2 rounded-lg font-hostGrotesk border-black bg-darkerCustomColor dark:bg-darkerCustomColor dark:text-white hover:bg-gray-800 dark:hover:hover:bg-gray-800 cursor-pointer"
                  value={selectedMostSpentDays}
                  onChange={(e) =>
                    setSelectedMostSpentDays(Number(e.target.value))
                  }
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
          </div>
        </div>
      </div>
    </div>
  );
}
