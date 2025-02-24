"use client";

import Image from "next/image";
import Link from "next/link";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, firestore } from "../../../../../firebase/firebase";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import AddProductsModal from "../../Modals/AddProductsModal";
import { doc, getDoc } from "firebase/firestore";
import useSidebarStore from "./sidebarStore";
import useTotalSpent from "@/hooks/useTotalSpent";

export default function Sidebar() {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const totalSpent = useSidebarStore((state) => state.totalSpent);

  const handleModalToggle = () => {
    if (!isModalVisible) {
      setIsModalVisible(true);
      setTimeout(() => setIsModalOpen(true), 10);
    } else {
      setIsModalOpen(false);
      setTimeout(() => setIsModalVisible(false), 0);
    }
  };

  const pathname = usePathname();

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getUserID = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        setUserPhoto(user.photoURL);

        const userDocRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.name || "Usuário");
        } else {
          setUserName("Usuário");
        }
      } else {
        setUserId(null);
        setUserName(null);
      }
    });

    return () => getUserID();
  }, []);

  useTotalSpent(userId);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // verificar tamanho inicial

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {isModalVisible && (
        <AddProductsModal
          isModalOpen={isModalOpen}
          handleModalToggle={handleModalToggle}
        />
      )}
      {!isMenuOpen && (
        <button
          className="fixed top-20 left-4 z-50 md:hidden"
          onClick={() => setIsMenuOpen(true)}
        >
          <Image
            className="block dark:hidden"
            src={"./icons/hamburger-menu-black.svg"}
            alt="menu-icon"
            width={30}
            height={30}
          />
          <Image
            className="hidden dark:block"
            src={"./icons/hamburger-menu-white.svg"}
            alt="menu-icon"
            width={30}
            height={30}
          />
        </button>
      )}
      <aside
        className={`mr-64 flex flex-col fixed w-64 h-screen px-4 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-darkerCustomColor font-raleway transition-transform duration-300 ease-in-out z-30 ${
          isMenuOpen
            ? "translate-x-0 w-full"
            : "-translate-x-full md:translate-x-0 md:w-64"
        }`}
      >
        <div className="relative mt-12 mb-6 flex flex-col items-start font-workSans md:hidden">
          <button className="" onClick={() => setIsMenuOpen(false)}>
            <Image
              className="block dark:hidden"
              src={"./icons/cancel.svg"}
              alt="cancel-icon"
              width={30}
              height={30}
            />
            <Image
              className="hidden dark:block"
              src={"./icons/cancel-white.svg"}
              alt="cancel-icon"
              width={30}
              height={30}
            />
          </button>
        </div>

        <div className="relative flex flex-col m-2 font-workSans border rounded-md md:mt-12">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-start justify-center mt-1">
              <Image
                className="block dark:hidden"
                src={"/icons/sidebar-moneybag-black.svg"}
                alt="home-icon"
                width={40}
                height={40}
              />
              <Image
                className="hidden dark:block"
                src={"/icons/sidebar-moneybag-white.svg"}
                alt="home-icon"
                width={40}
                height={40}
              />
            </div>
            <div className="flex flex-row items-center m-1 font-medium">
              <span className="dark:text-white">Gastos até hoje:</span>
            </div>

            <span className="flex flex-row items-center mb-2 w-auto bg-white dark:bg-darkerCustomColor dark:text-white">
              <p className="font-medium">
                {totalSpent.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                })}
              </p>
            </span>
          </div>
        </div>

        <div>
          <span className="flex items-center justify-center px-4 py-2 mt-5 text-gray-900 font-medium hover:bg-gray-100 transition-colors duration-300 transform rounded-md dark:text-white dark:hover:bg-white dark:hover:text-black group">
            <button
              onClick={handleModalToggle}
              className="flex flex-row items-center"
            >
              <Image
                className="mr-2 block dark:hidden group-hover:hidden"
                src={"/icons/sidebar-add.svg"}
                alt="home-icon"
                width={30}
                height={30}
              />
              <Image
                className="mr-2 hidden dark:block group-hover:hidden"
                src={"/icons/sidebar-add-white.svg"}
                alt="home-icon"
                width={30}
                height={30}
              />
              <Image
                className="mr-2 hidden dark:hidden group-hover:block"
                src={"/icons/sidebar-add-black.svg"}
                alt="home-icon"
                width={30}
                height={30}
              />
              Adicionar compra
            </button>
          </span>
        </div>

        <hr className="mt-4 border-gray-200 dark:border-gray-500" />

        <div className="flex flex-col justify-between flex-1">
          <nav>
            <Link
              key={"/home"}
              href={"home"}
              className={`group flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 dark:hover:bg-white dark:hover:text-black ${
                pathname === "/home"
                  ? "bg-gray-100 text-gray-900 dark:bg-gray-100 dark:text-black"
                  : "hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-black"
              }`}
            >
              <Image
                className={` group-hover:hidden ${
                  pathname === "/home" ? "dark:hidden" : "dark:block"
                }`}
                src={"/icons/sidebar-home.svg"}
                alt="home-icon"
                width={30}
                height={30}
              />

              <Image
                className={`hidden group-hover:block ${
                  pathname === "/home" ? "dark:block" : "dark:hidden"
                }`}
                src={"/icons/sidebar-home-black.svg"}
                alt="home-icon"
                width={30}
                height={30}
              />

              <span
                className={`mx-4 font-medium ${
                  pathname === "/home" ? "dark:text-black" : ""
                }`}
              >
                Página Inicial
              </span>
            </Link>

            <Link
              key={"/minhas-compras"}
              href={"minhas-compras"}
              className={`group flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 dark:hover:bg-white dark:hover:text-black ${
                pathname === "/minhas-compras"
                  ? "bg-gray-100 text-gray-900 dark:bg-gray-100 dark:text-black"
                  : "hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-black"
              }`}
            >
              <Image
                className={`group-hover:hidden ${
                  pathname === "/minhas-compras" ? "dark:hidden" : "dark:block"
                }`}
                src={"/icons/sidebar-table.svg"}
                alt="table-icon"
                width={30}
                height={30}
              />

              <Image
                className={`hidden group-hover:block ${
                  pathname === "/minhas-compras" ? "dark:block" : "dark:hidden"
                }`}
                src={"/icons/sidebar-table-black.svg"}
                alt="table-icon"
                width={30}
                height={30}
              />

              <span
                className={`mx-4 font-medium ${
                  pathname === "/minhas-compras" ? "dark:text-black" : ""
                }`}
              >
                Minhas Compras
              </span>
            </Link>

            <Link
              key={"/conta"}
              href={"conta"}
              className={`group flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 dark:hover:bg-white dark:hover:text-black ${
                pathname === "/conta"
                  ? "bg-gray-100 text-gray-900 dark:bg-gray-100 dark:text-black"
                  : "hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-black"
              }`}
            >
              <Image
                className={`group-hover:hidden ${
                  pathname === "/conta" ? "dark:hidden" : "dark:block"
                }`}
                src={"/icons/sidebar-settings.svg"}
                alt="settings-icon"
                width={30}
                height={30}
              />

              <Image
                className={`hidden group-hover:block ${
                  pathname === "/conta" ? "dark:block" : "dark:hidden"
                }`}
                src={"/icons/sidebar-settings-black.svg"}
                alt="settings-icon"
                width={30}
                height={30}
              />

              <span
                className={`mx-4 font-medium ${
                  pathname === "/conta" ? "dark:text-black" : ""
                }`}
              >
                Conta
              </span>
            </Link>

            <hr className="mt-4 border-gray-200 dark:border-gray-600" />

            <button
              className="group flex items-center px-4 py-2 mt-5 w-full text-gray-600 transition-colors duration-300 transform rounded-md hover:bg-gray-100 dark:hover:bg-white dark:hover:text-black dark:text-gray-400"
              onClick={handleLogout}
            >
              <Image
                className="block dark:block group-hover:hidden"
                src={"/icons/sidebar-logout.svg"}
                alt="logout-icon"
                width={30}
                height={30}
              />
              <Image
                className="hidden group-hover:block dark:hidden"
                src={"/icons/sidebar-logout-black.svg"}
                alt="logout-icon"
                width={30}
                height={30}
              />

              <span className="mx-4 font-medium">Sair</span>
            </button>
          </nav>

          <Link href="/conta" className="flex items-center px-4 -mx-2">
            <Image
              width={100}
              height={100}
              className="object-cover mx-2 rounded-full h-9 w-9"
              src={userPhoto || "./icons/sidebar-account.svg"}
              alt="account-photo"
            />
            <span className="font-medium text-gray-800 dark:text-gray-200">
              {userName ? userName : ""}
            </span>
          </Link>
        </div>
      </aside>
    </>
  );
}
