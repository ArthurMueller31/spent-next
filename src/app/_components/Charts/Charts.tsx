"use client";
import { PieChart } from "@mui/x-charts";
import { useState, useEffect } from "react";
import { auth, firestore } from "../../../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "../Navigation/Navbar/Navbar";
import Sidebar from "../Navigation/Sidebar/Sidebar";
import RecentPurchases from "../Tables/RecentPurchases";
import Link from "next/link";
import { LineChartComponent } from "./LineChartComponent";
import BarChartComponent from "./BarChartComponent";

export default function Charts() {
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

  // Query para o gráfico de barras (todas as compras - all time)
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
            : "Mercado";

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
                  Gastos por categoria
                </span>
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
            <LineChartComponent />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between dark:bg-white h-max">
            <BarChartComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
