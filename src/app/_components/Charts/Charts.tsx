"use client";
import Navbar from "../Navigation/Navbar/Navbar";
import Sidebar from "../Navigation/Sidebar/Sidebar";
import RecentPurchases from "../Tables/RecentPurchases";
import { LineChartComponent } from "./LineChartComponent";
import BarChartComponent from "./BarChartComponent";
import PieChartComponent from "./PieChartComponent";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../../firebase/firebase";
import { useEffect, useState } from "react";

export default function Charts() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return () => getUserId();
  }, []);

  return (
    <div className="relative">
      <Sidebar />
      <Navbar />
      <div className="md:pl-64 md:ml-12 px-14 pb-4 pt-20 h-screen overflow-auto font-raleway tracking-wide bg-gray-50 dark:bg-darkerCustomColor overflow-y-auto">
        <div className="grid grid-cols-1 gap-8 h-full xl:grid-cols-2 xl:grid-rows-2">
          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center dark:bg-white ">
            <RecentPurchases userId={userId} />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-center dark:bg-white">
            <PieChartComponent userId={userId} />
          </div>

          {/* gráfico de linhas, compras nos últimos x dias */}
          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between dark:bg-white">
            <LineChartComponent userId={userId} />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between dark:bg-white h-max">
            <BarChartComponent userId={userId} />
          </div>
        </div>
      </div>
    </div>
  );
}
