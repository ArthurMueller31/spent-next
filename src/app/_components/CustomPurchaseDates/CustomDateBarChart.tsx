"use client";

import { BarChart } from "@mui/x-charts";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../../../../firebase/firebase";
import { usePurchases } from "@/hooks/usePurchases";
import Image from "next/image";
import NoPurchasesInPeriodModal from "../Modals/NoPurchasesInPeriodModal";
import FutureDataSelectionModal from "../Modals/FutureDataSelectionModal";

export default function CustomDateBarChart() {
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedPeriodBarChart, setSelectedPeriodBarChart] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [userHasPurchasesInPeriod, setUserHasPurchasesInPeriod] = useState<
    Record<number, boolean>
  >({
    1: true,
    5: true,
    7: true,
    14: true,
    30: true,
    90: true,
    180: true,
    365: true,
    730: true,
    1095: true
  });
  const [barChartData, setBarChartData] = useState<number[]>([]);
  const [barChartDates, setBarChartDates] = useState<string[]>([]);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [isNoPurchaseInPeriodModalOpen, setIsNoPurchaseInPeriodModalOpen] =
    useState(false);
  const [userSelectedFutureDataModalOpen, setUserSelectedFutureDataModalOpen] =
    useState(false);
  const [totalExpenses, setTotalExpenses] = useState(0);

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

  const { purchases } = usePurchases(userId);

  useEffect(() => {
    if (!userId) return;
    if (!purchases || purchases.length === 0) return;

    const endDate = new Date();
    let filteredPurchases = [...purchases];

    if (customStartDate && customEndDate) {
      const start = new Date(customStartDate);
      const end = new Date(customEndDate);
      filteredPurchases = filteredPurchases.filter((purchase) => {
        const dateParts = purchase.purchaseDate.split("-");
        const purchaseDateObj = new Date(
          parseInt(dateParts[0], 10),
          parseInt(dateParts[1], 10) - 1,
          parseInt(dateParts[2], 10)
        );

        return purchaseDateObj >= start && purchaseDateObj <= end;
      });
    }

    // Se "Todas" estiver selecionado, não filtramos por data.
    else if (selectedPeriodBarChart === "all") {
      filteredPurchases = purchases;
    } else {
      const period = Number(selectedPeriodBarChart);
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - period);
      filteredPurchases = purchases.filter((purchase) => {
        const dateParts = purchase.purchaseDate.split("-");
        const purchaseDateObj = new Date(
          parseInt(dateParts[0], 10),
          parseInt(dateParts[1], 10) - 1,
          parseInt(dateParts[2], 10)
        );
        return purchaseDateObj >= startDate && purchaseDateObj <= endDate;
      });
    }

    const categoriesSet = new Set<string>();
    filteredPurchases.forEach((purchase) => {
      if (purchase.category && purchase.category.trim() !== "") {
        categoriesSet.add(purchase.category);
      }
    });
    setAvailableCategories(Array.from(categoriesSet));

    if (selectedCategory !== "all") {
      filteredPurchases = filteredPurchases.filter(
        (purchase) => purchase.category === selectedCategory
      );
    }

    if (filteredPurchases.length === 0) {
      setIsNoPurchaseInPeriodModalOpen(true);
      setCustomStartDate("");
      setCustomEndDate("");
      setSelectedPeriodBarChart("all");
      setSelectedCategory("all");
      setBarChartDates([]);
      setBarChartData([]);
      setTotalExpenses(0);
      return;
    }

    const calculateFilteredTotal = filteredPurchases.reduce((acc, purchase) => {
      const totalSpent = purchase.items.reduce<number>(
        (sum, item) => sum + parseFloat(item.price) * parseFloat(item.quantity),
        0
      );
      return acc + totalSpent;
    }, 0);
    setTotalExpenses(calculateFilteredTotal);

    // Calcula os totais por data
    const totals: { [date: string]: number } = {};
    filteredPurchases.forEach((purchase) => {
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

    const sortedDates = Object.keys(totals).sort((a, b) => {
      const [dayA, monthA, yearA] = a.split("/").map(Number);
      const [dayB, monthB, yearB] = b.split("/").map(Number);
      return (
        new Date(yearA, monthA - 1, dayA).getTime() -
        new Date(yearB, monthB - 1, dayB).getTime()
      );
    });

    setBarChartDates(sortedDates);
    setBarChartData(
      sortedDates.map((date) => parseFloat(totals[date].toFixed(2)))
    );
  }, [
    selectedPeriodBarChart,
    selectedCategory,
    userId,
    purchases,
    customStartDate,
    customEndDate
  ]);

  useEffect(() => {
    if (
      selectedCategory !== "all" &&
      !availableCategories.includes(selectedCategory)
    ) {
      setSelectedCategory("all");
    }
  }, [availableCategories, selectedCategory]);

  useEffect(() => {
    if (!userId) return;

    const periods = [1, 5, 7, 14, 30, 90, 180, 365, 730, 1095];
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

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedPeriodBarChart(value);

    setCustomStartDate("");
    setCustomEndDate("");
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCategory(value);
  };

  const today = new Date().toISOString().split("T")[0];

  const handleCustomStartDateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedDate = e.target.value;
    if (selectedDate > today) {
      setUserSelectedFutureDataModalOpen(true);
      return;
    }
    setCustomStartDate(selectedDate);
  };

  const handleCustomEndDateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedDate = e.target.value;
    if (selectedDate > today) {
      setUserSelectedFutureDataModalOpen(true);
      return;
    }
    setCustomEndDate(selectedDate);
  };

  return (
    <>
      <div className="md:pl-64 md:ml-12 px-14 pb-2 pt-[68px] h-screen overflow-auto font-hostGrotesk tracking-wide bg-gray-50 dark:bg-darkerCustomColor overflow-y-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 dark:bg-white">
          <div className="grid grid-rows-2 2xl:flex 2xl:justify-between mb-20 h-fit sm:mb-10 sm:h-44 xl:mb-0">
            <div className="text-center xl:text-left h-12 mt-5 xl:mt-2">
              <span className="pr-2 dark:text-black">
                {selectedPeriodBarChart === "all"
                  ? "Exibindo"
                  : "Exibindo compras de"}
              </span>
              <select
                className="text-center bg-darkerCustomColor border border-darkerCustomColor rounded p-2 cursor-pointer text-white dark:text-white"
                onChange={handlePeriodChange}
                value={selectedPeriodBarChart}
              >
                <option value={"all"}>Todas</option>
                <option value={1} disabled={!userHasPurchasesInPeriod[1]}>
                  1 dia
                </option>
                <option value={5} disabled={!userHasPurchasesInPeriod[5]}>
                  5 dias
                </option>
                <option value={7} disabled={!userHasPurchasesInPeriod[7]}>
                  7 dias
                </option>
                <option value={14} disabled={!userHasPurchasesInPeriod[14]}>
                  2 semanas
                </option>
                <option value={30} disabled={!userHasPurchasesInPeriod[30]}>
                  1 mês
                </option>
                <option value={90} disabled={!userHasPurchasesInPeriod[90]}>
                  3 meses
                </option>
                <option value={180} disabled={!userHasPurchasesInPeriod[180]}>
                  6 meses
                </option>
                <option value={365} disabled={!userHasPurchasesInPeriod[365]}>
                  1 ano
                </option>
                <option value={730} disabled={!userHasPurchasesInPeriod[730]}>
                  2 anos
                </option>
                <option value={1095} disabled={!userHasPurchasesInPeriod[1095]}>
                  3 anos
                </option>
              </select>
              <span className="pl-2 dark:text-black">
                {selectedPeriodBarChart === "all"
                  ? "as compras"
                  : "atrás até hoje"}
              </span>
            </div>
            <div className="2xl:block grid grid-rows-3 mb-[-30px] justify-center xl:justify-normal ">
              <div className="mt-1 xl:mt-0 max-h-12 w-full text-center xl:text-left">
                <span className="pr-2 dark:text-black">
                  Selecionar data personalizada -
                </span>
                <span className="pr-2 dark:text-black">de</span>
                <input
                  type="date"
                  className="text-center px-2 border border-darkerCustomColor bg-darkerCustomColor p-1 rounded-lg text-white dark:text-white w-full sm:w-fit mb-3"
                  onChange={handleCustomStartDateChange}
                  value={customStartDate}
                />
                <span className="px-2 dark:text-black text-center md:text-left">
                  até
                </span>
                <input
                  type="date"
                  className="text-center border border-darkerCustomColor bg-darkerCustomColor p-1 rounded-lg text-white dark:text-white w-full sm:w-fit mt-3"
                  onChange={handleCustomEndDateChange}
                  value={customEndDate}
                />
              </div>
            </div>
          </div>
          <div className="w-full">
            <div className="text-center xl:text-left dark:text-black 2xl:mt-[-80px]">
              <span className="pr-2">Mostrar por categoria:</span>
              <select
                onChange={handleCategoryChange}
                value={selectedCategory}
                className="text-center bg-darkerCustomColor border border-darkerCustomColor rounded p-2 cursor-pointer text-white w-full sm:w-fit dark:text-white"
              >
                <option value={"all"}>Todas</option>
                <option
                  value={"Mercado"}
                  disabled={!availableCategories.includes("Mercado")}
                >
                  Mercado
                </option>
                <option
                  value={"Lazer/Entretenimento"}
                  disabled={
                    !availableCategories.includes("Lazer/Entretenimento")
                  }
                >
                  Lazer/Entretenimento
                </option>
                <option
                  value={"Eletrônicos/Tecnologia"}
                  disabled={
                    !availableCategories.includes("Eletrônicos/Tecnologia")
                  }
                >
                  Eletrônicos/Tecnologia
                </option>
                <option
                  value={"Casa/Decoração"}
                  disabled={!availableCategories.includes("Casa/Decoração")}
                >
                  Casa/Decoração
                </option>
                <option
                  value={"Outros"}
                  disabled={!availableCategories.includes("Outros")}
                >
                  Outros
                </option>
                <option
                  value={"Não especificado"}
                  disabled={!availableCategories.includes("Não especificado")}
                >
                  Não especificado
                </option>
              </select>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="w-full h-[70vh]">
              <BarChart
                xAxis={[{ data: barChartDates, scaleType: "band" }]}
                yAxis={[
                  {
                    valueFormatter: (value: number): string =>
                      `${new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                      }).format(value)}`
                  }
                ]}
                series={[
                  {
                    valueFormatter: (value: number | null): string =>
                      value === null
                        ? "R$0,00"
                        : `${new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL"
                          }).format(value)}`,
                    data: barChartData,
                    color: "#1d1e22"
                  }
                ]}
                margin={{ left: 100 }}
              />
            </div>
          </div>
          <div className="grid grid-rows-2 justify-center lg:flex lg:justify-between">
            <div className="mb-5 text-center lg:mb-0 lg:text-left">
              Gastos totais com esses filtros:{" "}
              <strong>
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                }).format(totalExpenses)}
              </strong>
            </div>
            <div className="flex justify-start items-center">
              <Image
                className="mr-2"
                src={"icons/info-black.svg"}
                width={20}
                height={20}
                alt="info-icon"
              />
              <p className="dark:text-black text-left">
                Datas ordenadas da menor à maior
              </p>
            </div>
          </div>
        </div>
      </div>

      <NoPurchasesInPeriodModal
        isOpen={isNoPurchaseInPeriodModalOpen}
        onClose={() => setIsNoPurchaseInPeriodModalOpen(false)}
      />

      <FutureDataSelectionModal
        isOpen={userSelectedFutureDataModalOpen}
        onClose={() => setUserSelectedFutureDataModalOpen(false)}
      />
    </>
  );
}
